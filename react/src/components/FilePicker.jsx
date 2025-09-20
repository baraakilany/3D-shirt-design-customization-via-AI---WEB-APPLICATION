import React from 'react'

import CustomButton from './CustomButton'

const FilePicker = ({file, setFile, readFile}) => {
  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*" //accept only image files
          onChange={(e) => setFile(e.target.files[0])} //set the selected file to state
        />
        <label html for="file-upload" className="filepicker-label">
          Upload file
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === '' ? "No file selected" : file.name}
        </p>

      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile('logo')} //read the file as a logo decal
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={() => readFile('full')} //read the file as a logo decal
          customStyles="text-xs"
        />

      </div>

    </div>
  )
}

export default FilePicker