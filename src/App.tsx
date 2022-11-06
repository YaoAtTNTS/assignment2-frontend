
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


function App() {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-device-width: 1224px)'});
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isTabletOrMobileDevice = useMediaQuery({query: '(max-device-width: 1224px)'});
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

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
    fetch('http://localhost:8080/invoice/list')
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


  return (
      <div style={containerStyle}>
        <div className="App">
          <ChakraProvider>
            <FileUploader/>
          </ChakraProvider>

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
