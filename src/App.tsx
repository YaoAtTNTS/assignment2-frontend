
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMediaQuery } from 'react-responsive'
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import {IInvoiceData, IPageData} from './interface/interfaces';
import {  ChakraProvider } from "@chakra-ui/react";
import FileUploader from "./component/FileUploader";
import {PaginationChangedEvent} from "ag-grid-community/dist/lib/events";
import SearchBox from "./component/SearchBox";


function App() {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-device-width: 1224px)'});
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTabletOrMobileDevice = useMediaQuery({query: '(max-device-width: 1224px)'});
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  const baseUrl: URL = new URL('http://localhost:8080/invoice/list')

  const gridRef = useRef<AgGridReact<IInvoiceData>>(null);
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState<IInvoiceData[]>();
  const [columnDefs] = useState<ColDef[]>([
    { headerName: 'Invoice No', field: 'invoiceNo' },
    { headerName: 'Stock Code', field: 'stockCode' },
    { headerName: 'Description', field: 'description' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Invoice Date', field: 'invoiceDate' },
    { headerName: 'Unit Price', field: 'unitPrice' },
    { headerName: 'Customer ID', field: 'customerId' },
    { headerName: 'Country', field: 'country' },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      filter: true,
    };
  }, []);

  const [next, setNext] = useState(null);
  const [maxPageNo, setMaxPageNo] = useState(4);
  const nextRef = useRef(null)
  useEffect(() => {
    nextRef.current = next
  }, [next]);
  const maxPageNoRef = useRef(4);
  useEffect(() => {
    maxPageNoRef.current = maxPageNo
  }, [next]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch(baseUrl)
        .then((resp) => resp.json())
        .then((data: IPageData) => {
          setNext(data.next)
          return data.results
        })
        .then((data: IInvoiceData[]) => setRowData(data));
  }, []);

  const onPaginationChanged = useCallback((params: PaginationChangedEvent) => {
    if (gridRef.current.api != null) {
      if (gridRef.current.api.paginationGetCurrentPage() === maxPageNoRef.current) {
        if (nextRef.current != null) {
          fetch(nextRef.current)
              .then((resp) => resp.json())
              .then((data: any) => {
                setNext(data.next)
                setMaxPageNo(gridRef.current.api.paginationGetCurrentPage() + 5)
                return data.results
              })
              .then((data: IInvoiceData[]) => setRowData(rowData => [...rowData, ...data]));
        }
      }
    }
  }, []);

  const [searchFields] = useState([
    {value: "invoice_no", label:"Invoice No"},
    {value: "stock_code", label:"Stock Code"},
    {value: "description", label:"Description"},
    {value: "customer_id", label:"Customer ID"},
    {value: "country", label:"Country"},
  ])

  const [selectedFields, setSelectedFields] = useState([{value: "invoice_no", label:"Invoice No"}]);
  const selectedFieldRef = useRef([{value: "invoice_no", label:"Invoice No"}]);
  useEffect(() => {
    selectedFieldRef.current = selectedFields
  }, [selectedFields]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef('');
  useEffect(() => {
    searchKeywordRef.current = searchKeyword
  }, [searchKeyword]);

  const onSearch = useCallback(() => {
    if (selectedFieldRef.current[0].value != null && searchKeywordRef.current !== '') {
      fetch(baseUrl + '?field=' + selectedFieldRef.current[0].value + '&keyword=' + searchKeywordRef.current)
          .then((resp) => resp.json())
          .then((data: IPageData) => {
            setNext(data.next)
            return data.results
          })
          .then((data: IInvoiceData[]) => setRowData(data));
    } else {
      fetch(baseUrl)
          .then((resp) => resp.json())
          .then((data: IPageData) => {
            setNext(data.next)
            return data.results
          })
          .then((data: IInvoiceData[]) => setRowData(data));
    }
  }, []);

  const onSelect = useCallback((record) => {
    console.log(record)
    setSelectedFields(record)
  }, [])

  const onChange = useCallback((keyword) => {
    console.log(keyword)
    setSearchKeyword(keyword.target.value);
  }, [])


  return (
      <div style={containerStyle}>
        <div className="App">
          <p>
            <SearchBox onSearch={onSearch} onChange={onChange} options={searchFields} onSelect={onSelect} values={selectedFields} isTabletOrMobile={isTabletOrMobile}/>
            { isTabletOrMobile && <div><br/><br/></div> }
            <ChakraProvider>
              <FileUploader onUploadComplete={onSearch}/>
            </ChakraProvider>
          </p>

          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact<IInvoiceData>
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={20}
                onGridReady={onGridReady}
                onPaginationChanged={onPaginationChanged}
            ></AgGridReact>
          </div>
        </div>
      </div>
  );
}

export default App;
