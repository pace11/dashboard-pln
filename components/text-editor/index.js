import Quill from 'react-quill'

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ align: [] }],
    [{ color: [] }],
    ['code-block'],
    ['clean'],
  ],
}

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'align',
  'color',
  'code-block',
]

const TextEditor = ({ value, onChange }) => {
  return (
    <Quill
      value={value}
      onChange={onChange}
      modules={quillModules}
      formats={quillFormats}
    />
  )
}

export default TextEditor
