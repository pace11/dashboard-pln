import { formatDate } from '@/helpers/utils'

const baseAlignment = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'center',
}

const baseFont = {
  bold: true,
}

const titleHeadBg = 'F1C232'
const borderColor = '9C9C9C'
const borderStyle = 'thin'

const baseBorder = {
  top: { style: borderStyle, color: { rgb: borderColor } },
  right: { style: borderStyle, color: { rgb: borderColor } },
  bottom: { style: borderStyle, color: { rgb: borderColor } },
  left: { style: borderStyle, color: { rgb: borderColor } },
}

const titleHeadStyle = {
  alignment: baseAlignment,
  font: baseFont,
  fill: { fgColor: { rgb: titleHeadBg } },
  border: baseBorder,
}

export const columnsTitleListNews = [
  { title: 'ID', width: { wch: 5 }, style: titleHeadStyle },
  { title: 'Title', width: { wch: 40 }, style: titleHeadStyle },
  { title: 'Slug', width: { wch: 40 }, style: titleHeadStyle },
  { title: 'Category', width: { wch: 15 }, style: titleHeadStyle },
  { title: 'Description', width: { wch: 50 }, style: titleHeadStyle },
  { title: 'Status', width: { wch: 15 }, style: titleHeadStyle },
  { title: 'Posted', width: { wch: 15 }, style: titleHeadStyle },
  { title: 'Banner', width: { wch: 15 }, style: titleHeadStyle },
  { title: 'Unit', width: { wch: 25 }, style: titleHeadStyle },
  { title: 'Created By', width: { wch: 25 }, style: titleHeadStyle },
  { title: 'Created At', width: { wch: 25 }, style: titleHeadStyle },
  {
    title: 'Checked By Date',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Checked By Email',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Checked By Remarks',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Approved By Date',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Approved By Email',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Approved By Remarks',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Checked By Date',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Checked By Email',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Checked By Remarks',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Approved By Date',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Approved By Email',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
  {
    title: 'Final Approved By Remarks',
    width: { wch: 25 },
    style: titleHeadStyle,
  },
]

export const toExportNewsData = (data = []) => {
  const defaultTotalData = columnsTitleListNews.length
  let reports = []

  if (data && data.length === 0) {
    const newArr = []
    Array.from(Array(defaultTotalData)).forEach(() => {
      newArr.push({
        value: '',
      })
    })
    reports.push(newArr)
    return { reports }
  }

  reports = data.map((item) => [
    { value: item.id || '-' },
    { value: item.title || '-' },
    { value: item.slug || '-' },
    { value: item.categories.title || '-' },
    { value: item.description || '-' },
    { value: item.status || '-' },
    { value: item.posted ? 'Ya' : 'Tidak' },
    { value: item.banner ? 'Ya' : 'Tidak' },
    { value: item.unit.title || '-' },
    { value: item.user.email || '-' },
    { value: formatDate(item.created_at) },
    { value: formatDate(item.checked_by_date) },
    { value: item.checked_by_email || '-' },
    { value: item.checked_by_remarks || '-' },
    { value: formatDate(item.approved_by_date) },
    { value: item.approved_by_email || '-' },
    { value: item.approved_by_remarks || '-' },
    { value: formatDate(item.final_checked_by_date) },
    { value: item.final_checked_by_email || '-' },
    { value: item.final_checked_by_remarks || '-' },
    { value: formatDate(item.final_approved_by_date) },
    { value: item.final_approved_by_email || '-' },
    { value: item.final_approved_by_remarks || '-' },
  ])

  return { reports }
}
