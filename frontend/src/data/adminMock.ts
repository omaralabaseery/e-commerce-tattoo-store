export const stats = {
  totalSales: 18420.5,
  totalOrders: 342,
  totalCustomers: 1280,
  totalProducts: 96,
  pendingOrders: 12,
  lowStockCount: 5,
};

export const revenueSeries = [
  { day: "Mon", revenue: 1820 },
  { day: "Tue", revenue: 2240 },
  { day: "Wed", revenue: 1980 },
  { day: "Thu", revenue: 2630 },
  { day: "Fri", revenue: 3120 },
  { day: "Sat", revenue: 3680 },
  { day: "Sun", revenue: 2950 },
];

export const recentOrders = [
  { number: "TS-260606101201", customer: "Ahmad K.", total: 357.5, status: "PENDING", date: "2026-06-06" },
  { number: "TS-260606094510", customer: "Sara M.", total: 84.0, status: "CONFIRMED", date: "2026-06-06" },
  { number: "TS-260605182233", customer: "Studio Ink Co.", total: 1240.0, status: "PROCESSING", date: "2026-06-05" },
  { number: "TS-260605120044", customer: "Yousef A.", total: 219.0, status: "OUT_FOR_DELIVERY", date: "2026-06-05" },
  { number: "TS-260604160500", customer: "Layla H.", total: 47.4, status: "DELIVERED", date: "2026-06-04" },
];

export const lowStock = [
  { name: "Starter Artist Kit", sku: "KIT-001", stock: 3, limit: 3 },
  { name: "FK Irons Spektra Flux", sku: "MCH-002", stock: 4, limit: 5 },
  { name: "Critical Power Supply CX-2", sku: "PWR-001", stock: 2, limit: 5 },
];

export const adminProducts = [
  { id: 1, name: "Cheyenne Hawk Pen", sku: "MCH-001", category: "Machines", price: 185, stock: 24, status: "ACTIVE" },
  { id: 2, name: "FK Irons Spektra Flux", sku: "MCH-002", category: "Machines", price: 320, stock: 4, status: "ACTIVE" },
  { id: 3, name: "Eternal Ink — Black Onyx", sku: "INK-001", category: "Ink", price: 22, stock: 80, status: "ACTIVE" },
  { id: 5, name: "Kwadron Cartridges 3RL", sku: "CRT-001", category: "Cartridges", price: 28, stock: 120, status: "ACTIVE" },
  { id: 9, name: "Starter Artist Kit", sku: "KIT-001", category: "Kits", price: 410, stock: 3, status: "ACTIVE" },
];

export const statusStyles: Record<string, string> = {
  PENDING: "bg-mist text-ink",
  CONFIRMED: "bg-ink/10 text-ink",
  PROCESSING: "bg-ink/10 text-ink",
  OUT_FOR_DELIVERY: "bg-ink text-paper",
  DELIVERED: "bg-ink text-paper",
  CANCELLED: "bg-mist text-muted line-through",
  RETURNED: "bg-mist text-muted",
};
