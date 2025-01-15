import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap', // Allow rows to wrap content
  },
  tableCell: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    wordWrap: 'break-word', // Ensures long content breaks within the cell
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
});

// Function to create rows dynamically for a long table
const createTableRows = () => {
  const rows = [];
  for (let i = 0; i < 50; i++) {
    rows.push(
      <View style={styles.tableRow} key={i}>
        <Text style={styles.tableCell}>{`Row ${i + 1} - Column 1 with long content that might break across pages`}</Text>
        <Text style={styles.tableCell}>{`Row ${i + 1} - Column 2 with more content`}</Text>
        <Text style={styles.tableCell}>{`Row ${i + 1} - Column 3 and some more text for testing wrapping across pages`}</Text>
      </View>
    );
  }
  return rows;
};

// Define the PDF document with a repeating header and footer
const MyDocument = () => (
  <Document>
    {/* Create first page */}
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <Text style={styles.header}>Long Table with Fixed Footer</Text>

      {/* Table Header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Header 1</Text>
          <Text style={styles.tableCell}>Header 2</Text>
          <Text style={styles.tableCell}>Header 3</Text>
        </View>
      </View>

      {/* Table Rows */}
      {createTableRows().slice(0, 25)} {/* Display first 25 rows */}

      {/* Footer */}
      <Text style={styles.footer}>This is a fixed footer that appears on every page.</Text>
    </Page>

    {/* Create second page with header and remaining rows */}
    <Page size="A4" style={styles.page}>
      {/* Table Header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Header 1</Text>
          <Text style={styles.tableCell}>Header 2</Text>
          <Text style={styles.tableCell}>Header 3</Text>
        </View>
      </View>

      {/* Table Rows */}
      {createTableRows().slice(25)} {/* Display remaining rows */}

      {/* Footer */}
      <Text style={styles.footer}>This is a fixed footer that appears on every page.</Text>
    </Page>
  </Document>
);

// App Component to render PDF
const App = () => (
  <div>
    <h1>Download PDF with Table and Footer</h1>
    <PDFDownloadLink
      document={<MyDocument />}
      fileName="long-table-with-footer.pdf"
      style={{
        textDecoration: 'none',
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '5px',
      }}
    >
      {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  </div>
);

export default App;
