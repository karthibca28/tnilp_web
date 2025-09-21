import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/service/toast.service';

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  title: string;
  contract: string;
  depot: string;
  vehicleType: string;
  period: string;
  status: string;
  dueDate: string;
  baseAmount: number;
  penalties: number;
  incentives: number;
  adjustments: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: string;
  billTo: {
    name: string;
    address: string;
    gst: string;
  };
  vendor: {
    name: string;
    contract: string;
    depot: string;
    gst: string;
  };
  baseBilling: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  penaltiesDetails: Array<{
    category: string;
    notes: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  incentivesDetails: Array<{
    category: string;
    notes: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  approvals: Array<{
    step: string;
    by: string;
    date: string;
    status: string;
  }>;
  paymentHistory: Array<{
    date: string;
    method: string;
    reference: string;
    amount: number;
  }>;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
}

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit {
  invoice: InvoiceDetails | null = null;
  invoiceId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      this.loadInvoiceDetails();
    });
  }

  loadInvoiceDetails(): void {
    // Mock data based on the image
    this.invoice = {
      id: this.invoiceId,
      invoiceNumber: 'INV-2025-0001',
      title: 'Metro Invoice - 2025/07',
      contract: 'Contract-A',
      depot: 'Central Depot',
      vehicleType: 'AC',
      period: '2025-07',
      status: 'Partial',
      dueDate: '2025-08-15',
      baseAmount: 1038000,
      penalties: 54999,
      incentives: 20000,
      adjustments: 0,
      subtotal: 1003001,
      tax: 180540,
      totalAmount: 1183541,
      paidAmount: 500000,
      outstandingAmount: 683541,
      paymentStatus: 'Partial',
      billTo: {
        name: 'City Transport Authority',
        address: 'Civic Center, Downtown',
        gst: '29ABCDE1234F1Z5'
      },
      vendor: {
        name: 'Metro Transports',
        contract: 'Contract-A',
        depot: 'Central',
        gst: '29METRO1234T1Z2'
      },
      baseBilling: [
        {
          description: 'Scheduled Trips Billed',
          quantity: 1200,
          rate: 850,
          amount: 1020000
        },
        {
          description: 'KM Overrun (excess)',
          quantity: 1500,
          rate: 12,
          amount: 18000
        }
      ],
      penaltiesDetails: [
        {
          category: 'Late Departures',
          notes: 'Based on KPI breaches',
          quantity: 45,
          rate: 1000,
          amount: 45000
        },
        {
          category: 'Breakdown',
          notes: '3 incidents',
          quantity: 3,
          rate: 3333,
          amount: 9999
        }
      ],
      incentivesDetails: [
        {
          category: 'Punctuality Bonus',
          notes: '> 92%',
          quantity: 1,
          rate: 20000,
          amount: 20000
        }
      ],
      approvals: [
        {
          step: 'Created',
          by: 'System',
          date: '2025-08-01',
          status: 'Completed'
        },
        {
          step: 'Depot Review',
          by: 'Central Manager',
          date: '2025-08-03',
          status: 'Approved'
        },
        {
          step: 'Finance',
          by: 'Accounts Payable',
          date: '',
          status: 'Pending'
        }
      ],
      paymentHistory: [
        {
          date: '2025-08-10',
          method: 'NEFT',
          reference: 'NEFT78412',
          amount: 500000
        }
      ],
      bankDetails: {
        bankName: 'Bank of Metro',
        accountNumber: '123456789',
        ifsc: 'METR0000123'
      }
    };
  }

  // Action Methods
  onSendEmail(): void {
    this.toastService.showInfo('Send Email', 'Email functionality will be available soon.', 2000);
  }

  onExportCSV(): void {
    this.toastService.showInfo('Export CSV', 'CSV export functionality will be available soon.', 2000);
  }

  onPrintPDF(): void {
    this.toastService.showInfo('Print/PDF', 'Print/PDF functionality will be available soon.', 2000);
  }

  onBackToDashboard(): void {
    this.router.navigate(['/invoice-dashboard']);
  }

  // Utility Methods
  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return '0';
    }
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
