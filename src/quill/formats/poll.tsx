/** pollFormat.js */
import { createTable, getCoreRowModelSync, useTableInstance } from '@tanstack/react-table';
import Quill from 'quill';
import React from 'react';
import { createPortal } from 'react-dom';
import { v4 } from 'uuid';

const BlockEmbed = Quill.import('blots/block/embed');

const PollComponent = ({}) => {
  function getData() {
    return 'data';
  }

  const [data, setData] = React.useState(() => [...defaultData])
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ])

  const rerender = React.useReducer(() => ({}), {})[1]

  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModelSync(),
  })

  return (
    <div>
        <table>
          <thead>
            {instance.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{cell.renderCell()}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {instance.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : header.renderFooter()}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        
        <button onClick={() => rerender()} className="border p-2">
          Rerender
        </button>

        <table>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
    </div>
  )

}

export class Poll extends BlockEmbed {
  static blotName = 'poll';
  static tagName = 'div';
  static className = `ql-custom`;
  static ref = {};

  static create(value: any) {
    console.log({ value });
    const id = v4();
    let node = super.create(value);
    const refs = Poll.refs;
    node.setAttribute('data-id', id);
    Poll.data = value;
    Poll.refs = {
      ...refs,
      [id]: React.createRef(),
    };
    return node;
  }

  static value(domNode: { getAttribute: (arg0: string) => any; }) {
    const id = domNode.getAttribute('data-id');
    const ref = Poll.refs[id];
    return ref && ref.current && ref.current.getData();
  }

  constructor(node: any, domNode: { getAttribute: (arg0: string) => any; }, third: any) {
    console.log({ domNode });
    super(node, domNode, third);
    this.id = domNode.getAttribute('data-id');
    this.data = Poll.data;
  }

  attach() {
    super.attach();
    this.scroll.emitter.emit('blot-mount', this);
  }

  renderPortal(id: string) {
    const { options } = Quill.find(this.scroll.domNode.parentNode);
    const ref = Poll.refs[id];
    return createPortal(
      //@ts-ignore
      <PollComponent type={Poll.blotName} node={this.data} ref={ref} readOnly={options.readOnly}/>,
      this.domNode
    );
  }

  detach() {
    super.detach();
    this.scroll.emitter.emit('blot-unmount', this);
  }
}

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable().setRowType<Person>()

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const defaultColumns = [
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.value,
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.value,
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createGroup({
        header: 'More Info',
        columns: [
          table.createDataColumn('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          table.createDataColumn('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          table.createDataColumn('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
