import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Organization } from '@/shared/types/organization.types';

interface InvoicePdfViewProps {
  invoice: {
    invoice_number: string;
    client: { name: string };
    issue_date: string;
    due_date: string;
    total: number;
    currency: string;
  };
  items: { description: string; quantity: number; unit_price: number; amount: number }[];
  organization?: Organization;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
  logo: { width: 80, height: 80, objectFit: 'contain' },
  organizationInfo: { textAlign: 'right', flex: 1 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  section: { marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  total: { marginTop: 10, fontWeight: 'bold' },
  legal: { marginTop: 20, fontSize: 10, color: '#888' },
});

export default function InvoicePdfView({ invoice, items, organization }: InvoicePdfViewProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo and organization info */}
        <View style={styles.header}>
          <View>
            {organization?.logo_url && (
              <Image style={styles.logo} src={organization.logo_url} />
            )}
          </View>
          <View style={styles.organizationInfo}>
            {organization && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                  {organization.name}
                </Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.title}>Facture n° {invoice.invoice_number}</Text>
        
        <View style={styles.section}>
          <Text>Client: {invoice.client.name}</Text>
          <Text>Date: {invoice.issue_date}</Text>
          <Text>Échéance: {invoice.due_date}</Text>
        </View>
        
        <View style={styles.section}>
          <Text>Lignes:</Text>
          {items.map((item, idx) => (
            <View style={styles.item} key={idx}>
              <Text>{item.description}</Text>
              <Text>
                {item.quantity} x {item.unit_price} = {item.amount}
              </Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.total}>
          Total: {invoice.total} {invoice.currency}
        </Text>
        
        <Text style={styles.legal}>Mentions légales: ...</Text>
      </Page>
    </Document>
  );
}
