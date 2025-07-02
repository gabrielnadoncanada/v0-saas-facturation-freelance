'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageSquare, Database, Zap } from 'lucide-react';

export function ChatbotDemo() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🤖 Assistant IA - Chatbot</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Assistant intelligent pour la gestion de facturation avec Groq AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Modèle IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="mb-2">
              Groq LLaMA 3.3 70B
            </Badge>
            <p className="text-sm text-muted-foreground">
              Utilise le modèle LLaMA 3.3 70B de Groq pour des réponses rapides et précises.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Outils Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">listInvoices</Badge>
              <Badge variant="outline">getInvoiceDetails</Badge>
              <Badge variant="outline">listClients</Badge>
              <Badge variant="outline">listProjects</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Intégration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connecté à votre base de données Supabase pour accéder aux factures, clients et
              projets en temps réel.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Exemples de Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">📄 Factures</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Montre-moi toutes les factures impayées"</li>
                <li>• "Quel est le statut de la facture INV-001?"</li>
                <li>• "Combien de factures sont en retard?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">👥 Clients</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Liste mes clients principaux"</li>
                <li>• "Qui sont mes clients les plus récents?"</li>
                <li>• "Combien de clients ai-je au total?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚀 Projets</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Montre-moi mes projets actifs"</li>
                <li>• "Quels projets sont terminés?"</li>
                <li>• "Y a-t-il des projets en pause?"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📊 Analyses</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Quel est mon chiffre d'affaires ce mois?"</li>
                <li>• "Combien ai-je de factures en attente?"</li>
                <li>• "Résume l'état de mes projets"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🏗️ Architecture Feature-Sliced Design</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <pre>{`features/chatbot/
├── chat/
│   ├── actions/
│   │   └── chat.action.ts      # Gestionnaire IA principal
│   ├── ui/
│   │   └── ChatInterface.tsx   # Interface de chat
│   ├── hooks/
│   │   └── useChat.ts          # Logique de chat
│   └── Chat.tsx                # Composant orchestrateur
├── demo/
│   └── DemoPage.tsx            # Page de démonstration
├── shared/
│   └── types/
│       └── index.ts            # Types partagés
└── README.md                   # Documentation

🔄 Réutilise les fonctions existantes :
├── @/features/invoice/list/model/getInvoices
├── @/features/invoice/view/model/getInvoice  
├── @/features/client/list/model/getClients
└── @/features/project/list/model/getProjects`}</pre>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-muted-foreground">
          Pour utiliser le chatbot, ajoutez votre clé API Groq dans <code>.env.local</code> et
          naviguez vers <code>/dashboard/chatbot</code>
        </p>
      </div>
    </div>
  );
}
