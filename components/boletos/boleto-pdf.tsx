import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    marginRight: 20,
    backgroundColor: '#e0e0e0', // Placeholder
  },
  bankCode: {
    fontSize: 20,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingRight: 10,
    marginRight: 10,
  },
  barcode: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#000', // Placeholder for barcode
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    flexGrow: 1,
    marginRight: -1, // Collapse borders
  }
});

interface BoletoPdfProps {
  data: {
    amount: number
    dueDate: Date
    clientName: string
    description?: string
  }
}

export const BoletoPdf = ({ data }: BoletoPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Recibo do Pagador (Top part) */}
      <View style={{ marginBottom: 40, borderBottomWidth: 1, borderStyle: 'dashed', paddingBottom: 20 }}>
          <Text style={{ fontSize: 12, marginBottom: 10 }}>Recibo do Pagador</Text>
          <View style={styles.row}>
             <View style={{ ...styles.box, flexBasis: '50%' }}>
                <Text style={styles.label}>Pagador</Text>
                <Text style={styles.value}>{data.clientName}</Text>
             </View>
             <View style={{ ...styles.box, flexBasis: '50%' }}>
                <Text style={styles.label}>Vencimento</Text>
                <Text style={styles.value}>{data.dueDate.toLocaleDateString()}</Text>
             </View>
          </View>
          <View style={styles.row}>
             <View style={{ ...styles.box, flexBasis: '100%' }}>
                <Text style={styles.label}>Valor</Text>
                <Text style={styles.value}>R$ {data.amount.toFixed(2)}</Text>
             </View>
          </View>
      </View>

      {/* Ficha de Compensação (Bottom part - Real Boleto) */}
      <View style={styles.header}>
        <View style={styles.logo} /> 
        <Text style={styles.bankCode}>001-9</Text>
        <Text style={{ fontSize: 14 }}>00190.00099 00000.000999 00000.000999 9 99990000000000</Text>
      </View>

      <View style={styles.row}>
        <View style={{ ...styles.box, flexGrow: 4 }}>
             <Text style={styles.label}>Local de Pagamento</Text>
             <Text style={styles.value}>PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO</Text>
        </View>
        <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Vencimento</Text>
             <Text style={styles.value}>{data.dueDate.toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ ...styles.box, flexGrow: 4 }}>
             <Text style={styles.label}>Beneficiário</Text>
             <Text style={styles.value}>SaaS Demo Company Ltda</Text>
        </View>
        <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Agência/Código Beneficiário</Text>
             <Text style={styles.value}>1234 / 56789-0</Text>
        </View>
      </View>

       <View style={styles.row}>
         <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Data Documento</Text>
             <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
         </View>
          <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Número Documento</Text>
             <Text style={styles.value}>123456</Text>
         </View>
          <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Espécie Doc.</Text>
             <Text style={styles.value}>DM</Text>
         </View>
          <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Aceite</Text>
             <Text style={styles.value}>N</Text>
         </View>
          <View style={{ ...styles.box, flexGrow: 1 }}>
             <Text style={styles.label}>Valor do Documento</Text>
             <Text style={styles.value}>R$ {data.amount.toFixed(2)}</Text>
         </View>
      </View>

      <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Pagador</Text>
          <Text style={styles.value}>{data.clientName}</Text>
      </View>

      {/* Dummy Barcode Area */}
      <View style={styles.barcode} />
    </Page>
  </Document>
);
