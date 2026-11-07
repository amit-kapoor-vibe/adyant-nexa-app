export interface InvoicePrintData {
  invoice_number: string;
  created_at: string;
  currency: string;
  state_type: string;
  client_name: string;
  client_email: string;
  client_gstin?: string;
  description?: string;
  base_amount: number;
  gst_amount: number;
  total_amount: number;
  status: string;
}

export function generateInvoiceHtml(inv: InvoicePrintData): string {
  const formattedDate = new Date(inv.created_at).toLocaleDateString();
  const isINR = inv.currency === "INR";
  const isAED = inv.currency === "AED";
  const symbol = isINR ? "₹" : isAED ? "AED " : "$";
  const gstRateText = inv.state_type === "INTRASTATE" ? "CGST (9%) + SGST (9%)" : "IGST (18%)";
  const taxDetailText = isINR 
    ? `GST: ${inv.state_type === "INTRASTATE" ? "CGST (9%) + SGST (9%)" : "Out-State IGST (18%)"}` 
    : isAED
    ? "UAE VAT Exempt / Standard 0% B2B Cross-Border"
    : "Export Services (Tax Exempt)";

  return `
    <html>
      <head>
        <title>Invoice - ${inv.invoice_number}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; margin: 40px; line-height: 1.6; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .header-table td { vertical-align: top; }
          .brand { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #000; }
          .brand-sub { font-size: 10px; color: #777; letter-spacing: 2px; }
          .invoice-details { text-align: right; font-size: 14px; }
          .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #111; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .details-table td { width: 50%; vertical-align: top; font-size: 14px; }
          .details-title { font-weight: bold; color: #555; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 8px; }
          .item-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .item-table th { background: #f9f9f9; border-bottom: 2px solid #eee; padding: 12px; font-size: 12px; font-weight: bold; text-align: left; text-transform: uppercase; color: #555; }
          .item-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-section { float: right; width: 300px; margin-top: 20px; }
          .total-table { width: 100%; border-collapse: collapse; font-size: 14px; }
          .total-table td { padding: 6px 12px; }
          .total-table tr.grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
          .footer-info { margin-top: 100px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777; text-align: center; }
          @media print {
            body { margin: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <div class="brand">ADYANT NEXA</div>
                <div class="brand-sub">AUTONOMOUS REAL ESTATE OPERATING SYSTEMS</div>
                <div style="font-size: 12px; color: #555; margin-top: 10px;">
                  Adyant Nexa Operations<br/>
                  Dubai // India Core<br/>
                  Email: contact@adyantnexa.com
                </div>
              </td>
              <td class="invoice-details">
                <div class="invoice-title">INVOICE</div>
                <b>Invoice #:</b> ${inv.invoice_number}<br/>
                <b>Date Issued:</b> ${formattedDate}<br/>
                <b>Status:</b> ${inv.status.toUpperCase()}
              </td>
            </tr>
          </table>

          <table class="details-table">
            <tr>
              <td>
                <div class="details-title">Billed To:</div>
                <b>${inv.client_name}</b><br/>
                Email: ${inv.client_email}<br/>
                ${inv.client_gstin ? `Tax ID / Reg: ${inv.client_gstin}` : ""}
              </td>
              <td>
                <div class="details-title">Service Provider:</div>
                <b>Adyant Nexa Operating Systems</b><br/>
                Tax Classification: ${taxDetailText}
              </td>
            </tr>
          </table>

          <table class="item-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right; width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Autonomous Real Estate AI Infrastructure Deployment</b>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">${inv.description || "24/7 WhatsApp AI Brokerage Sales Engine & Retainer"}</div>
                </td>
                <td style="text-align: right;">${symbol}${inv.base_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <table class="total-table">
              <tr>
                <td>Subtotal (Base):</td>
                <td style="text-align: right;">${symbol}${inv.base_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              ${isINR ? `
              <tr>
                <td>Tax (${gstRateText}):</td>
                <td style="text-align: right;">${symbol}${inv.gst_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
              ` : ""}
              <tr class="grand-total">
                <td>Total Due:</td>
                <td style="text-align: right;">${symbol}${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </table>
          </div>

          <div style="clear: both;"></div>

          <div class="footer-info">
            Thank you for deploying Adyant Nexa Autonomous Infrastructure. Computer generated document.
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
}
