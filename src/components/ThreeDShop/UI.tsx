import { Cart } from "./Cart";
import { ItemDetailPanel } from "./ItemDetailPanel";

export function UI() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="pointer-events-auto">
        <Cart />
        <ItemDetailPanel />
      </div>
    </div>
  );
}
