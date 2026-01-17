import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-50">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground bg-slate-900 border border-slate-800">
          Versão Beta 1.0.0
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
          Sistema de Gestão de Boletos
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-slate-400">
          Gerencie clientes, emita cobranças bancárias e automatize suas notificações financeiras em uma única plataforma.
        </p>
        <div className="flex gap-4 mt-6">
          <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-200">
            <Link href="/login">
              Acessar Sistema <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white bg-transparent">
             <Link href="/register">
              Criar Conta
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 text-left">
             <div className="flex flex-col gap-2 p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <h3 className="font-bold">Multitenant</h3>
                <p className="text-sm text-slate-400">Ambientes isolados para sua empresa e seus dados.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
                <h3 className="font-bold">Boletos PDF</h3>
                <p className="text-sm text-slate-400">Geração instantânea com branding personalizado.</p>
             </div>
             <div className="flex flex-col gap-2 p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                <CheckCircle2 className="h-6 w-6 text-purple-500" />
                <h3 className="font-bold">Automação</h3>
                <p className="text-sm text-slate-400">Notificações por e-mail e leitura via OCR.</p>
             </div>
        </div>
      </div>
    </main>
  )
}
