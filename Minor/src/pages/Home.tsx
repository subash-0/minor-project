'use client'

import React, { useState, useRef } from 'react'
import Layout from '../components/Layout'
import { Button } from '../components/button'
import { Send, Upload } from 'lucide-react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [colorizedImage, setColorizedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setColorizedImage(reader.result as string) // Reset colorized image when a new image is uploaded
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }



  return (
    <Layout  >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* <h2 className="text-2xl font-semibold mb-4">Image Colorizer</h2> */}
          <div className="mb-4 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <Button variant="outline" onClick={handleUpload} className="cursor-pointer">
              <Upload className="sm:mr-2 h-4 w-4" /> <span className='hidden sm:block'> {selectedImage?'Change Image' : 'Choose Image'} </span>
            </Button>

            <Button variant="outline" className="cursor-pointer">
              <Send className="sm:mr-2 h-4 w-4"  /> <span className='hidden sm:inline-block'> Colorize Image</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Original Image:</h3>
                <img src={selectedImage} alt="Original" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
            {colorizedImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Colorized Image:</h3>
                <img src={colorizedImage} alt="Colorized" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>
          {!selectedImage && !colorizedImage && (
            <div className="mt-4 p-8 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-500">No image selected. Please upload an image to colorize.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

