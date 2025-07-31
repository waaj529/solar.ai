import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

export function BillOfMaterials() {
  const bomItems = [
    { category: "Solar Panels", item: "Monocrystalline 400W", quantity: 75, unit: "pcs", unitPrice: 250, total: 18750 },
    { category: "Inverters", item: "String Inverter 5kW", quantity: 6, unit: "pcs", unitPrice: 1200, total: 7200 },
    { category: "Mounting", item: "Roof Mounting Rails", quantity: 150, unit: "m", unitPrice: 25, total: 3750 },
    { category: "Mounting", item: "Mounting Clamps", quantity: 300, unit: "pcs", unitPrice: 5, total: 1500 },
    { category: "Electrical", item: "DC Combiner Box", quantity: 3, unit: "pcs", unitPrice: 350, total: 1050 },
    { category: "Electrical", item: "AC Disconnect Switch", quantity: 1, unit: "pcs", unitPrice: 180, total: 180 },
    { category: "Cables", item: "DC Cable 4mm²", quantity: 500, unit: "m", unitPrice: 3.5, total: 1750 },
    { category: "Cables", item: "AC Cable 16mm²", quantity: 100, unit: "m", unitPrice: 8, total: 800 },
    { category: "Protection", item: "DC Circuit Breaker", quantity: 15, unit: "pcs", unitPrice: 45, total: 675 },
    { category: "Protection", item: "AC Circuit Breaker", quantity: 6, unit: "pcs", unitPrice: 65, total: 390 },
    { category: "Monitoring", item: "Production Meter", quantity: 1, unit: "pcs", unitPrice: 320, total: 320 },
    { category: "Accessories", item: "Grounding Equipment", quantity: 1, unit: "set", unitPrice: 450, total: 450 },
  ];

  const totalCost = bomItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Bill of Materials (BOM)</h2>
          <p className="text-muted-foreground">Complete list of components and materials required for the solar installation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bomItems.length}</div>
            <p className="text-sm text-muted-foreground">Line items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Material Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total materials</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Labor Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalCost * 0.3).toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Estimated labor</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Total Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalCost * 1.3).toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">All inclusive</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed BOM</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Item Description</th>
                  <th className="text-right p-3 font-semibold">Qty</th>
                  <th className="text-left p-3 font-semibold">Unit</th>
                  <th className="text-right p-3 font-semibold">Unit Price</th>
                  <th className="text-right p-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {bomItems.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-primary/5">
                    <td className="p-3 text-sm">{item.category}</td>
                    <td className="p-3 font-medium">{item.item}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-sm">{item.unit}</td>
                    <td className="p-3 text-right">${item.unitPrice}</td>
                    <td className="p-3 text-right font-semibold text-primary">${item.total}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-primary/20 bg-primary/10">
                  <td colSpan={5} className="p-3 font-bold text-right">Total Material Cost:</td>
                  <td className="p-3 text-right font-bold text-primary text-lg">${totalCost.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}