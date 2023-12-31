import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
		>
			<h1 className="text-6xl font-bold mb-5">Tic tac toe</h1>
			<div className="flex gap-10">
				<Link href="/create">create room</Link>
				<Link href="/join">join room</Link>
			</div>
		</main>
	);
}
