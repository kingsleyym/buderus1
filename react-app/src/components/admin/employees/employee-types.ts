export interface Employee {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    status: 'pending' | 'approved' | 'rejected' | 'disabled';
    fachpartner: string[];
    createdAt: string;
    lastLogin?: string;
    bio?: string;
    avatar?: string;
}

export interface FachpartnerOption {
    value: string;
    label: string;
    color: string;
}

export const FACHPARTNER_OPTIONS: FachpartnerOption[] = [
    { value: 'buderus', label: 'Buderus', color: '#FFD700' },
    { value: 'bosch', label: 'Bosch', color: '#0066CC' }
];

export interface ConfirmAction {
    type: 'approve' | 'reject' | 'disable';
    employee: Employee;
    message: string;
}
