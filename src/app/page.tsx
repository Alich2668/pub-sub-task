import PubSubClient from "@/components/PubSubClient"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Pub/Sub</h1>
        <PubSubClient />
      </div>
    </main>
  )
}

