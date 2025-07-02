// src/app/configuracoes/convenios/page.tsx

export default function ConveniosPage() {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestão de Convênios</h1>
          {/* Aqui entrará o botão para adicionar um novo convênio */}
        </div>
        <div className="rounded-md border bg-card p-8 text-center">
          <p className="text-muted-foreground">A tabela com a lista de convênios aparecerá aqui.</p>
        </div>
      </div>
    );
  }