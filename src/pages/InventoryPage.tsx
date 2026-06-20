import InventoryTable from '@/features/inventory/components/InventoryTable';

const InventoryPage = () => {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden p-4">
      <InventoryTable />
    </div>
  );
};

export default InventoryPage;
