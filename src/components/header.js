import { Search, Heart, ShoppingCart, User } from "lucide-react";
import Connect from "./buttons/Connect";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2">
      <h1 className="text-5xl font-murmure">Sppedo</h1>
      <nav className="flex-1">
        <ul className="flex justify-center space-x-4">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/women">Women</a>
          </li>
          <li>
            <a href="/men">Men</a>
          </li>
          <li>
            <a href="/kids">Kids</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>
      <div className="flex space-x-4 items-center">
        <a href="/search">
          <Search className="w-6 h-6" />
        </a>
        <a href="/favorites">
          <Heart className="w-6 h-6" />
        </a>
        <a href="/cart">
          <ShoppingCart className="w-6 h-6" />
        </a>
        <a href="/profile">
          <User className="w-6 h-6" />
        </a>
        <Connect />
      </div>
    </header>
  );
}
