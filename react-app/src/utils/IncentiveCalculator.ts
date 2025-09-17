// Förderungsberechnung nach BEG 2025
export interface IncentiveCalculationInput {
  productPrice: number;
  installationCosts: number;
  heatPumpType: 'air_water' | 'ground_water' | 'water_water';
  jahresarbeitszahl: number;
  annualIncome?: number; // Haushaltseinkommen
  replacesFossilHeating: boolean;
  isNewBuilding: boolean;
}

export interface IncentiveResult {
  baseIncentive: number;
  efficiencyBonus: number;
  heatSourceBonus: number;
  incomeBonus: number;
  totalIncentivePercent: number;
  totalIncentiveAmount: number;
  maxFundingAmount: number;
  eligibleCosts: number;
  remainingCosts: number;
  kfwCreditEligible: boolean;
  kfwMaxCredit: number;
  details: string[];
}

export class IncentiveCalculator {
  private static readonly BASE_INCENTIVE = 25; // 25%
  private static readonly EFFICIENCY_BONUS = 5; // 5% bei JAZ >= 4.5
  private static readonly HEAT_SOURCE_BONUS = 5; // 5% für Erdwärme/Wasser
  private static readonly INCOME_BONUS = 30; // 30% bei Einkommen <= 40.000€
  private static readonly MAX_FUNDING_PERCENT = 70; // Maximal 70%
  private static readonly MAX_FUNDING_AMOUNT = 30000; // 30.000€ pro Wohneinheit
  private static readonly MIN_JAZ_FOR_EFFICIENCY = 4.5;
  private static readonly INCOME_THRESHOLD = 40000; // 40.000€

  static calculate(input: IncentiveCalculationInput): IncentiveResult {
    const details: string[] = [];
    
    // Förderfähige Kosten
    const eligibleCosts = input.productPrice + input.installationCosts;
    details.push(`Förderfähige Kosten: ${this.formatPrice(eligibleCosts)}`);

    // Grundförderung
    const baseIncentive = this.BASE_INCENTIVE;
    details.push(`Grundförderung: ${baseIncentive}%`);

    // Effizienzbonus
    const efficiencyBonus = input.jahresarbeitszahl >= this.MIN_JAZ_FOR_EFFICIENCY ? this.EFFICIENCY_BONUS : 0;
    if (efficiencyBonus > 0) {
      details.push(`Effizienzbonus (JAZ ${input.jahresarbeitszahl} >= ${this.MIN_JAZ_FOR_EFFICIENCY}): +${efficiencyBonus}%`);
    }

    // Wärmequellenbonus
    const heatSourceBonus = this.getHeatSourceBonus(input.heatPumpType);
    if (heatSourceBonus > 0) {
      details.push(`Wärmequellenbonus (${this.getHeatPumpTypeLabel(input.heatPumpType)}): +${heatSourceBonus}%`);
    }

    // Einkommensbonus
    const incomeBonus = this.getIncomeBonus(input.annualIncome);
    if (incomeBonus > 0) {
      details.push(`Einkommensbonus (≤ ${this.formatPrice(this.INCOME_THRESHOLD)} Jahreseinkommen): +${incomeBonus}%`);
    }

    // Gesamtförderung berechnen
    let totalPercent = baseIncentive + efficiencyBonus + heatSourceBonus + incomeBonus;
    
    // Maximum prüfen
    if (totalPercent > this.MAX_FUNDING_PERCENT) {
      totalPercent = this.MAX_FUNDING_PERCENT;
      details.push(`Förderung auf Maximum begrenzt: ${this.MAX_FUNDING_PERCENT}%`);
    }

    // Förderbetrag berechnen
    let incentiveAmount = (eligibleCosts * totalPercent) / 100;
    
    // Maximalbetrag prüfen
    if (incentiveAmount > this.MAX_FUNDING_AMOUNT) {
      incentiveAmount = this.MAX_FUNDING_AMOUNT;
      details.push(`Förderung auf Höchstbetrag begrenzt: ${this.formatPrice(this.MAX_FUNDING_AMOUNT)}`);
    }

    const remainingCosts = eligibleCosts - incentiveAmount;

    // KfW-Kredit Berechtigung
    const kfwCreditEligible = !input.isNewBuilding && input.replacesFossilHeating;
    const kfwMaxCredit = kfwCreditEligible ? 150000 : 0;

    if (kfwCreditEligible) {
      details.push(`KfW-Kredit 261 möglich: bis zu ${this.formatPrice(kfwMaxCredit)} (0,01% Zinssatz)`);
    }

    return {
      baseIncentive,
      efficiencyBonus,
      heatSourceBonus,
      incomeBonus,
      totalIncentivePercent: totalPercent,
      totalIncentiveAmount: incentiveAmount,
      maxFundingAmount: this.MAX_FUNDING_AMOUNT,
      eligibleCosts,
      remainingCosts,
      kfwCreditEligible,
      kfwMaxCredit,
      details
    };
  }

  private static getHeatSourceBonus(type: string): number {
    // Erdwärme und Wasser-Wasser erhalten Wärmequellenbonus
    return ['ground_water', 'water_water'].includes(type) ? this.HEAT_SOURCE_BONUS : 0;
  }

  private static getIncomeBonus(annualIncome?: number): number {
    if (!annualIncome) return 0;
    return annualIncome <= this.INCOME_THRESHOLD ? this.INCOME_BONUS : 0;
  }

  private static getHeatPumpTypeLabel(type: string): string {
    const labels = {
      'air_water': 'Luft-Wasser',
      'ground_water': 'Sole-Wasser (Erdwärme)',
      'water_water': 'Wasser-Wasser'
    };
    return labels[type as keyof typeof labels] || type;
  }

  private static formatPrice(amount: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // Regionale Förderungen (vereinfacht)
  static getRegionalIncentives(state: string): { name: string; amount: number; description: string }[] {
    const regionalPrograms: Record<string, { name: string; amount: number; description: string }[]> = {
      'bayern': [
        {
          name: 'Bayern - 10.000-Häuser-Programm',
          amount: 2000,
          description: 'Zusätzlich 2.000€ für Wärmepumpen in Bayern'
        }
      ],
      'nrw': [
        {
          name: 'NRW - progres.nrw',
          amount: 1500,
          description: 'Bis zu 1.500€ Zuschuss in NRW'
        }
      ],
      'baden-württemberg': [
        {
          name: 'BW - Klimaschutz-Plus',
          amount: 3000,
          description: 'Bis zu 3.000€ für innovative Heizsysteme'
        }
      ]
    };

    return regionalPrograms[state.toLowerCase()] || [];
  }

  // Quick-Check für Kunden
  static quickCheck(productPrice: number, heatPumpType: string, jaz: number): {
    estimatedIncentive: number;
    minIncentive: number;
    maxIncentive: number;
    description: string;
  } {
    const baseInput: IncentiveCalculationInput = {
      productPrice,
      installationCosts: productPrice * 0.3, // Schätzung 30% Installation
      heatPumpType: heatPumpType as any,
      jahresarbeitszahl: jaz,
      replacesFossilHeating: true,
      isNewBuilding: false
    };

    // Minimum (ohne Boni)
    const minResult = this.calculate(baseInput);
    
    // Maximum (mit allen Boni)
    const maxInput = {
      ...baseInput,
      annualIncome: 35000 // Unter Schwellwert für Einkommensbonus
    };
    const maxResult = this.calculate(maxInput);

    // Durchschnitt für Schätzung
    const estimatedIncentive = (minResult.totalIncentiveAmount + maxResult.totalIncentiveAmount) / 2;

    return {
      estimatedIncentive,
      minIncentive: minResult.totalIncentiveAmount,
      maxIncentive: maxResult.totalIncentiveAmount,
      description: `Bei einem ${this.getHeatPumpTypeLabel(heatPumpType)} mit JAZ ${jaz} erhalten Sie zwischen ${this.formatPrice(minResult.totalIncentiveAmount)} und ${this.formatPrice(maxResult.totalIncentiveAmount)} BAFA-Förderung.`
    };
  }
}
