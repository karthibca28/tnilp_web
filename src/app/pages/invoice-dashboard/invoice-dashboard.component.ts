import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/service/toast.service';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  period: string;
  vendor: string;
  depot: string;
  contract: string;
  baseAmount: number;
  penalties: number;
  incentives: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Overdue' | 'Disputed';
  paymentStatus: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface StatusTab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-invoice-dashboard',
  templateUrl: './invoice-dashboard.component.html',
  styleUrls: ['./invoice-dashboard.component.scss']
})
export class InvoiceDashboardComponent implements OnInit {
  // Status Tabs
  statusTabs: StatusTab[] = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Paid', value: 'paid' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Disputed', value: 'disputed' }
  ];

  selectedStatus: string = 'all';

  // Filters
  selectedMonth: string = '2025-08';
  selectedVendor: string = 'all';
  selectedDepot: string = 'all';
  selectedContract: string = 'all';
  selectedPaymentStatus: string = 'all';
  searchTerm: string = '';

  // Summary Data
  totalInvoices: number = 3;
  totalAmount: number = 3366540;
  paidAmount: number = 1095040;
  outstandingAmount: number = 2271500;

  // Invoice Data
  invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2025-0004',
      period: '2025-08',
      vendor: 'Metro Transports',
      depot: 'Central',
      contract: 'Contract-A',
      baseAmount: 1150000,
      penalties: 40000,
      incentives: 25000,
      tax: 204300,
      totalAmount: 1339300,
      paidAmount: 0,
      dueDate: '2025-09-15',
      status: 'Draft',
      paymentStatus: 'Unpaid'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2025-0005',
      period: '2025-08',
      vendor: 'BlueLine Services',
      depot: 'North',
      contract: 'Contract-B',
      baseAmount: 920000,
      penalties: 10000,
      incentives: 18000,
      tax: 167040,
      totalAmount: 1095040,
      paidAmount: 1095040,
      dueDate: '2025-09-12',
      status: 'Paid',
      paymentStatus: 'Paid'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2025-0006',
      period: '2025-08',
      vendor: 'Urban Wheels',
      depot: 'South',
      contract: 'Contract-A',
      baseAmount: 780000,
      penalties: 12000,
      incentives: 22000,
      tax: 142200,
      totalAmount: 932200,
      paidAmount: 0,
      dueDate: '2025-09-08',
      status: 'Disputed',
      paymentStatus: 'Unpaid'
    }
  ];

  filteredInvoices: Invoice[] = [];

  constructor(
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.filteredInvoices = [...this.invoices];
    this.updateSummaryData();
  }

  // Status Tab Methods
  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  // Filter Methods
  onSearch(): void {
    this.applyFilters();
  }

  onResetFilters(): void {
    this.selectedMonth = '2025-08';
    this.selectedVendor = 'all';
    this.selectedDepot = 'all';
    this.selectedContract = 'all';
    this.selectedPaymentStatus = 'all';
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredInvoices = this.invoices.filter(invoice => {
      // Status filter
      if (this.selectedStatus !== 'all' && invoice.status.toLowerCase() !== this.selectedStatus) {
        return false;
      }

      // Month filter
      if (this.selectedMonth !== 'all' && invoice.period !== this.selectedMonth) {
        return false;
      }

      // Vendor filter
      if (this.selectedVendor !== 'all' && invoice.vendor.toLowerCase().replace(/\s+/g, '-') !== this.selectedVendor) {
        return false;
      }

      // Depot filter
      if (this.selectedDepot !== 'all' && invoice.depot.toLowerCase() !== this.selectedDepot) {
        return false;
      }

      // Contract filter
      if (this.selectedContract !== 'all' && invoice.contract.toLowerCase().replace(/\s+/g, '-') !== this.selectedContract) {
        return false;
      }

      // Payment status filter
      if (this.selectedPaymentStatus !== 'all' && invoice.paymentStatus.toLowerCase() !== this.selectedPaymentStatus) {
        return false;
      }

      // Search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
               invoice.vendor.toLowerCase().includes(searchLower) ||
               invoice.depot.toLowerCase().includes(searchLower) ||
               invoice.contract.toLowerCase().includes(searchLower);
      }

      return true;
    });

    this.updateSummaryData();
  }

  updateSummaryData(): void {
    this.totalInvoices = this.filteredInvoices.length;
    this.totalAmount = this.filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    this.paidAmount = this.filteredInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
    this.outstandingAmount = this.totalAmount - this.paidAmount;
  }

  // Action Methods
  onGenerateInvoice(): void {
    this.toastService.showInfo('Generate Invoice', 'Generate invoice functionality will be available soon.', 2000);
  }

  onExportCSV(): void {
    this.toastService.showInfo('Export CSV', 'CSV export functionality will be available soon.', 2000);
  }

  onCopyTable(): void {
    this.toastService.showInfo('Copy Table', 'Table copied to clipboard.', 2000);
  }

  onDownloadXLSX(): void {
    this.toastService.showInfo('Download XLSX', 'XLSX download functionality will be available soon.', 2000);
  }

  onViewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoice-view', invoice.id]);
  }

  // Utility Methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getProgressPercentage(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min((value / max) * 100, 100);
  }

  trackByInvoice(index: number, invoice: Invoice): string {
    return invoice.id;
  }
}
