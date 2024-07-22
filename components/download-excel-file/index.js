import ReactExport from 'react-data-export'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ReactExport.ExcelFile

const DownloadExcelFile = ({
  fileName = 'DataSheet',
  dataDownload = [],
  sheetName = 'Sheet1',
}) => {
  return (
    <ExcelFile filename={fileName} hideElement>
      <ExcelSheet dataSet={dataDownload} name={sheetName} />
    </ExcelFile>
  )
}

export default DownloadExcelFile
