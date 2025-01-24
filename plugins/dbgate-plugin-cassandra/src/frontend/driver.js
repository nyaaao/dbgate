const { driverBase } = global.DBGATE_PACKAGES['dbgate-tools'];
const Dumper = require('./Dumper');
const { mysqlSplitterOptions } = require('dbgate-query-splitter/lib/options');
const _cloneDeepWith = require('lodash/cloneDeepWith');

/** @type {import('dbgate-types').SqlDialect} */
const dialect = {
  limitSelect: true,
  rangeSelect: true,
  stringEscapeChar: "'",
  fallbackDataType: 'varchar',
  offsetNotSupported: true,
  allowMultipleValuesInsert: false,
  createColumn: true,
  dropColumn: true,
  changeColumn: true,
  changeAutoIncrement: true,
  createIndex: true,
  dropIndex: true,
  anonymousPrimaryKey: true,
  createColumnWithColumnKeyword: true,
  specificNullabilityImplementation: true,
  disableRenameTable: true,
  generateDefaultValueForUuid: 'uuid()',
  omitForeignKeys: true,
  omitUniqueConstraints: true,
  omitIndexes: true,
  omitTableAliases: true,
  omitTableBeforeColumn: true,
  sortingKeys: true,
  predefinedDataTypes: [
    'custom',
    'ascii',
    'bigint',
    'blob',
    'boolean',
    'counter',
    'decimal',
    'double',
    'float',
    'int',
    'text',
    'timestamp',
    'uuid',
    'varchar',
    'varint',
    'timeuuid',
    'inet',
    'date',
    'time',
    'smallint',
    'tinyint',
    'duration',
    'list',
    'map',
    'set',
    'udt',
    'tuple',
  ],
  disableAutoIncrement: true,
  disableNonPrimaryKeyRename: true,
  defaultNewTableColumns: [
    {
      columnName: 'id',
      dataType: 'uuid',
      notNull: true,
    },
  ],
  columnProperties: {
    columnComment: true,
  },

  quoteIdentifier(s) {
    return `"${s}"`;
  },
};

/** @type {import('dbgate-types').EngineDriver} */
const driver = {
  ...driverBase,
  supportsTransactions: false,
  defaultPort: 9042,
  defaultLocalDataCenter: 'datacenter1',
  dumperClass: Dumper,
  dialect,
  engine: 'cassandra@dbgate-plugin-cassandra',
  title: 'Cassandra',
  showConnectionField: (field, values) =>
    ['server', 'port', 'singleDatabase', 'localDataCenter', 'isReadOnly', 'user', 'password'].includes(field),
  getQuerySplitterOptions: (usage) =>
    usage == 'editor'
      ? { ...mysqlSplitterOptions, ignoreComments: true, preventSingleLineSplit: true }
      : mysqlSplitterOptions,
  adaptTableInfo(table) {
    if (!table.primaryKey && !table.sortingKey) {
      return {
        ...table,
        primaryKey: {
          columns: [
            {
              columnName: 'id',
            },
          ],
        },
        columns: [
          {
            columnName: 'id',
            dataType: 'uuid',
          },
          ...table.columns,
        ],
      };
    }
    return table;
  },
};

module.exports = driver;
