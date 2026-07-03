import { SavedReport, ShopifyQlResult, INITIAL_SAVED_REPORTS, MOCK_DATABASE_TABLES } from '../database/shopifyql';

export class ShopifyQlService {
  private static STORAGE_KEY = 'noir_admin_shopifyql_reports';

  static getSavedReports(): SavedReport[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_SAVED_REPORTS));
      return INITIAL_SAVED_REPORTS;
    }
    return JSON.parse(stored);
  }

  static saveReports(reports: SavedReport[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
  }

  // Parses ShopifyQL query string and filters/aggregates mock tables
  static executeQuery(query: string): ShopifyQlResult {
    const cleaned = query.trim().replace(/\s+/g, ' ');
    const lowerQuery = cleaned.toLowerCase();

    // Determine target table
    let sourceTable: 'sales' | 'customers' = 'sales';
    if (lowerQuery.includes('from customers')) {
      sourceTable = 'customers';
    }

    const tableData: any[] = MOCK_DATABASE_TABLES[sourceTable];

    // Simple parser simulation
    // Extract fields (e.g., SHOW field1, field2 or sum(field))
    let showPart = '';
    const showMatch = cleaned.match(/show\s+(.*?)\s+from/i);
    if (showMatch) {
      showPart = showMatch[1];
    } else {
      // Fallback
      showPart = '*';
    }

    const fields = showPart.split(',').map(f => f.trim());

    // Extract GROUP BY
    let groupByField = '';
    const groupByMatch = cleaned.match(/group\s+by\s+(\w+)/i);
    if (groupByMatch) {
      groupByField = groupByMatch[1].toLowerCase();
    }

    // Process grouping & aggregation
    if (groupByField) {
      const groups: Record<string, any[]> = {};
      tableData.forEach(row => {
        const key = row[groupByField] || 'Others';
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      const rows: Record<string, any>[] = [];
      const columnsSet = new Set<string>();
      columnsSet.add(groupByField);

      Object.entries(groups).forEach(([groupName, items]) => {
        const groupedRow: Record<string, any> = { [groupByField]: groupName };
        
        fields.forEach(field => {
          const lowerField = field.toLowerCase();
          
          if (lowerField === groupByField) return;

          if (lowerField.startsWith('sum(')) {
            const rawCol = field.substring(4, field.length - 1);
            const sumValue = items.reduce((acc, current) => acc + (current[rawCol] || 0), 0);
            groupedRow[field] = sumValue;
            columnsSet.add(field);
          } else if (lowerField.startsWith('avg(')) {
            const rawCol = field.substring(4, field.length - 1);
            const sumValue = items.reduce((acc, current) => acc + (current[rawCol] || 0), 0);
            groupedRow[field] = parseFloat((sumValue / items.length).toFixed(1));
            columnsSet.add(field);
          } else if (lowerField.startsWith('count(')) {
            groupedRow[field] = items.length;
            columnsSet.add(field);
          } else {
            // Take the first available item's field value as fallback
            groupedRow[field] = items[0][field] || '';
            columnsSet.add(field);
          }
        });
        rows.push(groupedRow);
      });

      return {
        columns: Array.from(columnsSet),
        rows,
        totalCount: rows.length
      };
    } else {
      // No grouping, return raw mapped attributes
      const rows = tableData.map(row => {
        const mappedRow: Record<string, any> = {};
        fields.forEach(f => {
          if (f === '*') {
            Object.assign(mappedRow, row);
          } else {
            mappedRow[f] = row[f] || 0;
          }
        });
        return mappedRow;
      });

      const cols = fields[0] === '*' ? Object.keys(tableData[0]) : fields;
      return {
        columns: cols,
        rows,
        totalCount: rows.length
      };
    }
  }
}
