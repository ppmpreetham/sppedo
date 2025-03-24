import Image from "next/image";
import Header from "../components/header";
import Announcement from "../components/announcement";
import Advertisement from "../components/advertisement";
import Scene from "../components/timelinetest";

export default function Home() {
  return (
    <div className="p-0">
      <Announcement />
      <Header />
      <Advertisement />
      <Scene />
    </div>
  );
}
