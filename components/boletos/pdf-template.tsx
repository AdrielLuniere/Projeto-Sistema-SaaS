import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankLogo: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
      textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minHeight: 25,
  },
  col: {
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    padding: 4,
    flexGrow: 1,
  },
  label: {
      fontSize: 7,
      color: '#555',
      marginBottom: 2
  },
  value: {
      fontSize: 10,
      color: '#000',
  },
  barcode: {
    marginTop: 20,
    height: 40,
    backgroundColor: '#000', // Placeholder
    width: '100%'
  },
  instructions: {
      marginTop: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: '#000',
      minHeight: 60,
  }
});

interface BoletoTemplateProps {
    boleto: {
        id: string
        amount: number
        dueDate: Date
        description: string | null
        ourNumber: string | null
        client: {
            name: string
            document: string
            address: string | null
        }
        tenant: {
            name: string
            document: string
        }
    }
}

export const BoletoTemplate = ({ boleto }: BoletoTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Recibo do Pagador - Top Section */}
      <View style={{ marginBottom: 20, borderStyle: 'dashed', borderBottomWidth: 1, paddingBottom: 10 }}>
        <View style={styles.header}>
            <Text style={styles.bankLogo}>SaaS Bank</Text>
            <Text>Recibo do Pagador</Text>
        </View>
        <View style={styles.row}>
            <View style={[styles.col, { flex: 2 }]}>
                 <Text style={styles.label}>Beneficiário</Text>
                 <Text style={styles.value}>{boleto.tenant.name}</Text>
            </View>
             <View style={[styles.col, { flex: 1 }]}>
                 <Text style={styles.label}>CPF/CNPJ</Text>
                 <Text style={styles.value}>{boleto.tenant.document}</Text>
            </View>
        </View>
        <View style={styles.row}>
            <View style={[styles.col, { flex: 2 }]}>
                 <Text style={styles.label}>Pagador</Text>
                 <Text style={styles.value}>{boleto.client.name}</Text>
            </View>
            <View style={[styles.col, { flex: 1 }]}>
                 <Text style={styles.label}>Vencimento</Text>
                 <Text style={styles.value}>{boleto.dueDate.toLocaleDateString("pt-BR")}</Text>
            </View>
             <View style={[styles.col, { flex: 1 }]}>
                 <Text style={styles.label}>Valor</Text>
                 <Text style={styles.value}>
                    {boleto.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </Text>
            </View>
             <View style={[styles.col, { flex: 1 }]}>
                 <Text style={styles.label}>Nosso Número</Text>
                 <Text style={styles.value}>{boleto.ourNumber}</Text>
            </View>
        </View>
      </View>

      {/* Ficha de Compensação - Bottom Section */}
      <View>
         <View style={styles.header}>
            <Text style={styles.bankLogo}>SaaS Bank | 999-9</Text>
            <Text style={{ fontSize: 12 }}>99999.99999 99999.999999 99999.999999 9 99999999999999</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
            {/* Left Column (Wide) */}
            <View style={{ flex: 3 }}>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Local de Pagamento</Text>
                        <Text style={styles.value}>PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Beneficiário</Text>
                        <Text style={styles.value}>{boleto.tenant.name} - {boleto.tenant.document}</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Data do Documento</Text>
                        <Text style={styles.value}>{new Date().toLocaleDateString("pt-BR")}</Text>
                    </View>
                     <View style={styles.col}>
                        <Text style={styles.label}>Nº Documento</Text>
                        <Text style={styles.value}>{boleto.id.substring(0,8)}</Text>
                    </View>
                     <View style={styles.col}>
                        <Text style={styles.label}>Espécie</Text>
                        <Text style={styles.value}>R$</Text>
                    </View>
                     <View style={styles.col}>
                        <Text style={styles.label}>Aceite</Text>
                        <Text style={styles.value}>N</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                         <Text style={styles.label}>Uso do Banco</Text>
                    </View>
                     <View style={styles.col}>
                         <Text style={styles.label}>Carteira</Text>
                         <Text style={styles.value}>001</Text>
                    </View>
                     <View style={styles.col}>
                         <Text style={styles.label}>Moeda</Text>
                         <Text style={styles.value}>BRL</Text>
                    </View>
                </View>
                <View style={[styles.instructions]}>
                    <Text style={styles.label}>Instruções</Text>
                    <Text style={{ marginTop: 5 }}>{boleto.description || "Não receber após o vencimento."}</Text>
                    <Text>Juros de mora ao dia: R$ 0,00</Text>
                </View>
            </View>

            {/* Right Column (Narrow - Values) */}
            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#ccc' }}>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Vencimento</Text>
                        <Text style={[styles.value, { fontWeight: 'bold' }]}>{boleto.dueDate.toLocaleDateString("pt-BR")}</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Agência/Código Beneficiário</Text>
                        <Text style={styles.value}>0001 / 123456</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Nosso Número</Text>
                        <Text style={styles.value}>{boleto.ourNumber}</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>(=) Valor do Documento</Text>
                        <Text style={[styles.value, { fontWeight: 'bold' }]}>
                            {boleto.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>(-) Desconto</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>(+) Mora/Multa</Text>
                    </View>
                </View>
                 <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>(=) Valor Cobrado</Text>
                    </View>
                </View>
            </View>
        </View>

        <View style={{ marginTop: 10, padding: 10 }}>
            <Text style={styles.label}>Pagador</Text>
            <Text style={styles.value}>{boleto.client.name}</Text>
             <Text style={styles.value}>{boleto.client.address || "Endereço não informado"}</Text>
             <Text style={styles.value}>{boleto.client.document}</Text>
        </View>

        {/* Dummy Barcode Area */}
        <View style={{ marginTop: 20 }}>
             <Text style={{ fontSize: 8, marginBottom: 2 }}>Código de Barras (Representação Numérica)</Text>
             <View style={{ height: 40, backgroundColor: '#000', width: '80%' }}></View>
             <Text style={{ fontSize: 8, marginTop: 2 }}>[Barcode Visual Placeholder]</Text>
        </View>
      </View>
    </Page>
  </Document>
);
