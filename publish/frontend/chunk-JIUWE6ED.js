import{a as Y}from"./chunk-HLCGW7XR.js";import{a as X}from"./chunk-GJ2UVAYY.js";import{a as U,f as W}from"./chunk-W2NA3IEY.js";import{a as J,b as Q}from"./chunk-SANJT6BF.js";import{a as K,b as j}from"./chunk-WKZIOAT3.js";import"./chunk-CK25USOI.js";import{D as k,G as N,S as z,p as V,w as L,x as $}from"./chunk-UFSSFF3F.js";import"./chunk-EXQAENRP.js";import{Fa as F,Ha as B,Ia as q,Ja as H,j as A,k as D,n as R,p as I,s as G,za as T}from"./chunk-BBVVMQ7D.js";import{$b as S,Gb as b,Ib as M,Rb as i,Sb as _,Ta as a,Tb as d,Ua as E,Xb as O,Yb as y,Zb as P,cc as m,dc as w,ec as s,ha as C,jb as v,lb as u,ub as e,vb as n,wb as f}from"./chunk-ADHHQ3IC.js";import"./chunk-CWTPBX7D.js";function it(p,g){if(p&1&&(e(0,"mat-option",15),i(1),n()),p&2){let t=g.$implicit;u("value",t.eventGroupId),a(),d(" ",t.eventGroupName," ")}}function ot(p,g){p&1&&(e(0,"div",16),f(1,"mat-spinner",17),e(2,"p"),i(3,"Generating report..."),n()())}function at(p,g){if(p&1&&(e(0,"tr")(1,"td",34),i(2),n(),e(3,"td",35),i(4),m(5,"number"),n(),e(6,"td",35),i(7),m(8,"number"),n(),e(9,"td",36),i(10),n(),e(11,"td",35),i(12),m(13,"number"),n(),e(14,"td",35),i(15),m(16,"number"),n()()),p&2){let t=g.$implicit;a(2),_(t.receipt),a(2),d(" ",t.receiptAmountVal!==null?s(5,6,t.receiptAmountVal,"1.2-2"):""," "),a(3),d(" ",t.receiptAmount!==null?s(8,9,t.receiptAmount,"1.2-2"):""," "),a(3),_(t.payment),a(2),d(" ",t.voucherAmountVal!==null?s(13,12,t.voucherAmountVal,"1.2-2"):""," "),a(3),d(" ",t.paymentAmount!==null?s(16,15,t.paymentAmount,"1.2-2"):""," ")}}function rt(p,g){if(p&1&&(e(0,"div",18)(1,"div",19)(2,"h1",20),i(3),m(4,"uppercase"),n()(),e(5,"div",21)(6,"table",22)(7,"thead")(8,"tr")(9,"th",23),i(10,"Receipts"),n(),e(11,"th",24),i(12,"Receipt Amount (\u20B9)"),n(),e(13,"th",24),i(14,"Amount (\u20B9)"),n(),e(15,"th",25),i(16,"Payments"),n(),e(17,"th",24),i(18,"Voucher Amount (\u20B9)"),n(),e(19,"th",24),i(20,"Amount (\u20B9)"),n()()(),e(21,"tbody"),v(22,at,17,18,"tr",26),e(23,"tr",27),f(24,"td",28)(25,"td",28)(26,"td",28),e(27,"td",29),i(28,"Total Expenses"),n(),e(29,"td",30),i(30),m(31,"number"),n(),e(32,"td",30),i(33),m(34,"number"),n()(),e(35,"tr",27),f(36,"td",28)(37,"td",28)(38,"td",28),e(39,"td",29),i(40,"Income Over Expenditure"),n(),e(41,"td",30),i(42),m(43,"number"),n(),e(44,"td",30),i(45),m(46,"number"),n()(),e(47,"tr",31)(48,"td",32),i(49,"TOTAL"),n(),e(50,"td",33),i(51),m(52,"number"),n(),e(53,"td",33),i(54),m(55,"number"),n(),e(56,"td",32),i(57,"TOTAL"),n(),e(58,"td",33),i(59),m(60,"number"),n(),e(61,"td",33),i(62),m(63,"number"),n()()()()()()),p&2){let t=M();a(3),_(w(4,10,t.reportData.eventGroupName)),a(19),u("ngForOf",t.statementRows),a(8),d(" ",s(31,12,t.reportData.totalVoucherAmount,"1.2-2")," "),a(3),d(" ",s(34,15,t.reportData.totalPayments,"1.2-2")," "),a(9),d(" ",s(43,18,t.reportData.incomeOverExpenditureVal,"1.2-2")," "),a(3),d(" ",s(46,21,t.reportData.incomeOverExpenditure,"1.2-2")," "),a(6),d(" ",s(52,24,t.reportData.totalReceiptAmount,"1.2-2")," "),a(3),d(" ",s(55,27,t.reportData.totalReceipts,"1.2-2")," "),a(5),d(" ",s(60,30,t.reportData.totalReceiptAmount,"1.2-2")," "),a(3),d(" ",s(63,33,t.reportData.totalReceipts,"1.2-2")," ")}}function lt(p,g){p&1&&(e(0,"mat-card",37)(1,"mat-icon"),i(2,"analytics"),n(),e(3,"p"),i(4,'Please select an Event Group and click "View Report" to load the statement.'),n()())}var wt=(()=>{class p{constructor(t,l){this.reportService=t,this.eventGroupService=l,this.eventGroups=[],this.selectedEventGroupKey=null,this.isLoading=!1,this.reportData=null,this.statementRows=[]}ngOnInit(){this.loadEventGroups()}loadEventGroups(){this.eventGroupService.getEventGroups().subscribe({next:t=>{this.eventGroups=t.filter(l=>l.isActive).sort((l,o)=>l.eventGroupName.localeCompare(o.eventGroupName)),this.eventGroups.length>0&&(this.selectedEventGroupKey=this.eventGroups[0].eventGroupId,this.loadReport())},error:t=>console.error("Error fetching event groups:",t)})}loadReport(){this.selectedEventGroupKey&&(this.isLoading=!0,this.reportData=null,this.statementRows=[],this.reportService.getEventExpenses(this.selectedEventGroupKey).subscribe({next:t=>{this.reportData=t,this.alignRows(),this.isLoading=!1},error:t=>{console.error("Error generating report:",t),this.isLoading=!1}}))}alignRows(){if(!this.reportData)return;let t=this.reportData.receipts||[],l=this.reportData.payments||[],o=Math.max(t.length,l.length);this.statementRows=[];for(let r=0;r<o;r++)this.statementRows.push({receipt:t[r]?t[r].receipts:"",receiptAmountVal:t[r]?t[r].receiptAmount:null,receiptAmount:t[r]?t[r].amount:null,payment:l[r]?l[r].expenseDetails||l[r].payments:"",voucherAmountVal:l[r]?l[r].voucherAmount:null,paymentAmount:l[r]?l[r].amount:null})}exportToExcel(){if(!this.reportData)return;let t=this.reportData.eventGroupName||"Event_Report",l=`Event_Expenses_Report_${t.replace(/\s+/g,"_")}_${new Date().toISOString().split("T")[0]}.xls`,o=`
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .title { text-align: center; font-size: 16px; font-weight: bold; padding: 15px 0; text-transform: uppercase; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        th { border: 1px solid #000; background-color: #f2f2f2; font-weight: bold; padding: 8px; text-align: left; }
        td { border: 1px solid #cccccc; padding: 8px; }
        .text-right { text-align: right; }
        .amount { mso-number-format: "\\#\\,\\#\\#0\\.00"; }
        .bold { font-weight: bold; }
        .total-label { font-weight: bold; }
        .total-amount { font-weight: bold; border-top: 1px solid #000000; border-bottom: 3px double #000000; }
        .empty-cell { background-color: #fafafa; }
      </style>
      </head>
      <body>
        <div class="title">${t.toUpperCase()}</div>
        <table>
          <thead>
            <tr>
              <th>Receipts</th>
              <th>Receipt Amount</th>
              <th>Amount</th>
              <th>Payments</th>
              <th>Voucher Amount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
    `;this.statementRows.forEach(c=>{let Z=c.receiptAmountVal!==null?c.receiptAmountVal:"",tt=c.receiptAmount!==null?c.receiptAmount:"",et=c.voucherAmountVal!==null?c.voucherAmountVal:"",nt=c.paymentAmount!==null?c.paymentAmount:"";o+=`
        <tr>
          <td>${c.receipt}</td>
          <td class="text-right amount">${Z}</td>
          <td class="text-right amount">${tt}</td>
          <td>${c.payment}</td>
          <td class="text-right amount">${et}</td>
          <td class="text-right amount">${nt}</td>
        </tr>
      `}),o+=`
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="bold">Total Expenses</td>
        <td class="text-right amount bold">${(this.reportData.totalVoucherAmount||0).toFixed(2)}</td>
        <td class="text-right amount bold">${this.reportData.totalPayments.toFixed(2)}</td>
      </tr>
    `,o+=`
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="bold">Income Over Expenditure</td>
        <td class="text-right amount bold">${(this.reportData.incomeOverExpenditureVal||0).toFixed(2)}</td>
        <td class="text-right amount bold">${this.reportData.incomeOverExpenditure.toFixed(2)}</td>
      </tr>
    `;let r=this.reportData.totalReceipts;o+=`
      <tr class="bold">
        <td class="total-label">TOTAL</td>
        <td class="text-right amount total-amount">${(this.reportData.totalReceiptAmount||0).toFixed(2)}</td>
        <td class="text-right amount total-amount">${r.toFixed(2)}</td>
        <td class="total-label">TOTAL</td>
        <td class="text-right amount total-amount">${(this.reportData.totalReceiptAmount||0).toFixed(2)}</td>
        <td class="text-right amount total-amount">${r.toFixed(2)}</td>
      </tr>
    `,o+=`
          </tbody>
        </table>
      </body>
      </html>
    `;let x=new Blob([o],{type:"application/vnd.ms-excel;charset=utf-8"}),h=document.createElement("a");h.href=URL.createObjectURL(x),h.download=l,document.body.appendChild(h),h.click(),document.body.removeChild(h)}exportToPDF(){window.print()}static{this.\u0275fac=function(l){return new(l||p)(E(Y),E(X))}}static{this.\u0275cmp=C({type:p,selectors:[["app-event-expenses"]],standalone:!0,features:[S],decls:29,vars:8,consts:[[1,"report-container"],[1,"report-header","no-print"],[1,"subtitle"],[1,"filter-card","no-print"],[1,"filter-row"],["appearance","outline"],[3,"ngModelChange","selectionChange","ngModel"],[3,"value",4,"ngFor","ngForOf"],["mat-raised-button","","color","primary",1,"action-btn",3,"click","disabled"],[1,"spacer"],["mat-raised-button","","color","accent",1,"action-btn",3,"click","disabled"],["mat-raised-button","",1,"action-btn","print-btn",3,"click","disabled"],["class","spinner-container",4,"ngIf"],["class","statement-card printable-statement",4,"ngIf"],["class","no-data-card",4,"ngIf"],[3,"value"],[1,"spinner-container"],["diameter","40"],[1,"statement-card","printable-statement"],[1,"statement-header"],[1,"event-title"],[1,"statement-table-wrapper"],[1,"statement-table"],[1,"col-receipts"],[1,"col-amount","text-right"],[1,"col-payments"],[4,"ngFor","ngForOf"],[1,"subtotal-row"],[1,"empty-side"],[1,"label-cellbold"],[1,"amount-cellbold","text-right"],[1,"grand-total-row"],[1,"total-label"],[1,"total-val","text-right"],[1,"receipt-desc"],[1,"amount-val","text-right"],[1,"payment-desc"],[1,"no-data-card"]],template:function(l,o){l&1&&(e(0,"div",0)(1,"div",1)(2,"h2"),i(3,"Event Expenses Report"),n(),e(4,"p",2),i(5,"View side-by-side Receipts and Payments statement for Event Groups"),n()(),e(6,"mat-card",3)(7,"div",4)(8,"mat-form-field",5)(9,"mat-label"),i(10,"Select Event Group"),n(),e(11,"mat-select",6),P("ngModelChange",function(x){return y(o.selectedEventGroupKey,x)||(o.selectedEventGroupKey=x),x}),b("selectionChange",function(){return o.loadReport()}),v(12,it,2,2,"mat-option",7),n()(),e(13,"button",8),b("click",function(){return o.loadReport()}),e(14,"mat-icon"),i(15,"search"),n(),i(16," View Report "),n(),f(17,"div",9),e(18,"button",10),b("click",function(){return o.exportToExcel()}),e(19,"mat-icon"),i(20,"file_download"),n(),i(21," Export Excel "),n(),e(22,"button",11),b("click",function(){return o.exportToPDF()}),e(23,"mat-icon"),i(24,"print"),n(),i(25," Export PDF "),n()()(),v(26,ot,4,0,"div",12)(27,rt,64,36,"div",13)(28,lt,5,0,"mat-card",14),n()),l&2&&(a(11),O("ngModel",o.selectedEventGroupKey),a(),u("ngForOf",o.eventGroups),a(),u("disabled",o.isLoading),a(5),u("disabled",o.isLoading||!o.reportData),a(4),u("disabled",o.isLoading||!o.reportData),a(4),u("ngIf",o.isLoading),a(),u("ngIf",o.reportData&&!o.isLoading),a(),u("ngIf",!o.reportData&&!o.isLoading))},dependencies:[G,A,D,R,I,z,k,N,W,U,$,L,V,j,K,T,B,F,H,q,Q,J],styles:[".report-container[_ngcontent-%COMP%]{min-height:100vh}.report-header[_ngcontent-%COMP%]{margin-bottom:24px}.report-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 4px;font-size:1.6rem;color:#1a237e;font-weight:600}.subtitle[_ngcontent-%COMP%]{color:#64748b;margin:0;font-size:.95rem}.filter-card[_ngcontent-%COMP%]{padding:16px 24px;margin-bottom:24px}.filter-row[_ngcontent-%COMP%]{display:flex;gap:16px;align-items:center;flex-wrap:wrap;width:100%}.filter-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{flex:0 0 280px;margin-bottom:-16px}.action-btn[_ngcontent-%COMP%]{height:48px;padding:0 20px;font-weight:500;border-radius:8px}.print-btn[_ngcontent-%COMP%]{color:#fff}.spacer[_ngcontent-%COMP%]{flex:1 1 auto}.spinner-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 0;color:#64748b;gap:16px}.statement-card[_ngcontent-%COMP%]{border-radius:8px;padding:32px;margin-bottom:32px}.statement-header[_ngcontent-%COMP%]{text-align:center;margin-bottom:24px}.event-title[_ngcontent-%COMP%]{font-size:1.8rem;font-weight:700;color:#0f172a;margin:0;letter-spacing:.5px;text-transform:uppercase}.statement-table-wrapper[_ngcontent-%COMP%]{overflow-x:auto}.statement-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:.95rem;color:#000;table-layout:fixed}.col-receipts[_ngcontent-%COMP%], .col-payments[_ngcontent-%COMP%]{width:26%}.col-amount[_ngcontent-%COMP%]{width:12%}.statement-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{padding:10px 12px;font-weight:700;color:#0f172a;font-size:.95rem}.statement-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border-left:1px solid #000000;border-right:1px solid #000000;border-bottom:1px dashed #e2e8f0;padding:8px 12px;vertical-align:middle;height:38px}.text-right[_ngcontent-%COMP%]{text-align:right!important}.amount-val[_ngcontent-%COMP%]{font-family:Courier New,Courier,monospace;font-weight:600}.subtotal-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{height:38px}.label-cellbold[_ngcontent-%COMP%]{font-weight:700;color:#0f172a}.amount-cellbold[_ngcontent-%COMP%]{font-family:Courier New,Courier,monospace;font-weight:700;color:#0f172a}.grand-total-row[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border-top:1px solid #000000!important;border-bottom:3px double #000000!important;font-weight:800!important;font-size:1.05rem;color:#0f172a;height:42px}.total-label[_ngcontent-%COMP%]{font-weight:800}.total-val[_ngcontent-%COMP%]{font-family:Courier New,Courier,monospace;font-weight:800}.no-data-card[_ngcontent-%COMP%]{padding:48px;text-align:center;color:#64748b;border:1px dashed #cbd5e1;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.no-data-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:48px;width:48px;height:48px;color:#94a3b8}@media print{body[_ngcontent-%COMP%]{font-size:11pt}.no-print[_ngcontent-%COMP%], .report-header[_ngcontent-%COMP%], .filter-card[_ngcontent-%COMP%], .no-data-card[_ngcontent-%COMP%], .spinner-container[_ngcontent-%COMP%], app-sidebar[_ngcontent-%COMP%], .sidebar[_ngcontent-%COMP%], mat-sidenav[_ngcontent-%COMP%], header[_ngcontent-%COMP%], .app-header[_ngcontent-%COMP%]{display:none!important}.report-container[_ngcontent-%COMP%]{padding:0!important}.statement-card[_ngcontent-%COMP%]{border:none!important;padding:0!important;margin:0!important;width:100%!important}.statement-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .statement-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:6px 8px!important}@page{size:A4 landscape;margin:10mm 15mm}}"]})}}return p})();export{wt as EventExpensesComponent};
