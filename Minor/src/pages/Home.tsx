import React, { useState, useRef, useCallback, useEffect } from 'react'
import Layout from '../components/Layout'
import { Button } from '../components/button'
import { Download, File, Send, Upload } from 'lucide-react'
import { Input } from '../components/component'
import toast from 'react-hot-toast'

import { colorizeImage as colorizeImageApi, colorizeHistory,searchOneHistory,updateLabel,downloadImage } from "../utils/api/Colorize"
import ManageContext from '../utils/context/ManageContext'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [colorizedImage, setColorizedImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [label, setLabel] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { manage, setManage } = React.useContext(ManageContext)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file); // ✅ Store the file
      setPreview(URL.createObjectURL(file)); // ✅ Create preview URL
    }
  };
  
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const checkInput = () => {
    if (!selectedImage || !label) {
      toast.error('Please upload an image to colorize and enter a label.');
      return false
    }
    return true
  }

  const historys = useCallback(async () => {
    const data = await colorizeHistory()
    if (data) {
      setManage({ ...manage, history: data })
    }
  }, [])

  const searchOne = useCallback(async (id) => {
    console.log(manage.id)
    const data = await searchOneHistory(id)
    if (data) {
     
      setSelectedImage(null)
      setPreview(`${import.meta.env.VITE_IMAGE_URL}${data?.bwImage?.imageName}`)
      setColorizedImage(`${import.meta.env.VITE_IMAGE_URL}${data.coloredImage}`)
      setLabel(data?.bwImage?.label)
    }
  }, [])

  useEffect(() => {
    if (manage.id) {
      searchOne(manage.id)
    }
  }, [manage.id])

  useEffect(() => {
    historys()
  }, [historys])
  
  const updateLabels = useCallback(async () => {
   
    // Call the API to colorize the image
    console.log(manage.orgId)
    if (!label || manage.orgId === '') {
      toast.error('Please enter a label.')
      return
    }
    const response = await updateLabel(manage.orgId,label)
    historys() // Refresh history after colorizing the image
    
    if (response) {    
      setLabel(response.label)

      //show toast
      toast.success(response.message)
      
    }
  
  }, [manage.orgId,label])
  

 
  
  const colorizeImage = useCallback(async () => {
    if (!checkInput()) return

    // Call the API to colorize the image
    const response = await colorizeImageApi(selectedImage as File, label)
    historys() // Refresh history after colorizing the image
    
    if (response) {
      
     
    
      // Update the preview and colorized image URLs
      setPreview(`${import.meta.env.VITE_IMAGE_URL}${response.original}`)
      setColorizedImage(`${import.meta.env.VITE_IMAGE_URL}${response.colorized}`)

      //show toast
      toast.success(response.message)
      
    }
  
  }, [selectedImage, label, historys, manage, setManage])
  
 const isColorized = colorizedImage ? true : false

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
         
          <div className="mb-4 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            {
              isColorized ? (
                <Button variant="outline" className="cursor-pointer" onClick={()=>{setColorizedImage(null); setPreview(null);setSelectedImage(null); setLabel('')}}>
                <File className="sm:mr-2 h-4 w-4" /> <span className='hidden sm:inline-block'>Colorize Another Image</span>
              </Button>
              )
              :
              <Button variant="outline" onClick={handleUpload} className="cursor-pointer">
              <Upload className="sm:mr-2 h-4 w-4" /> <span className='hidden sm:block'>{selectedImage ? 'Change Image' : 'Choose Image'}</span>
            </Button>
            }
           
            <div className="">
              <Input
                placeholder="Enter a label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            {
              isColorized ?
              <Button variant="outline" className="cursor-pointer" onClick={updateLabels}>

              <Send className="sm:mr-2 h-4 w-4" /> <span className='hidden sm:inline-block'>Update Label</span>
            </Button>
              :
              <Button variant="outline" className="cursor-pointer" onClick={colorizeImage}>
              <Send className="sm:mr-2 h-4 w-4" /> <span className='hidden sm:inline-block'>Colorize Image</span>
            </Button> 
            }
          </div>
         
        

   
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preview && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Original Image:</h3>
                <img src={preview} alt="Original" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
            {colorizedImage && (
              <div>
                <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-2">Colorized Image:</h3>
               <Button variant="ghost" onClick={()=>downloadImage({imageUrl:colorizedImage, label})}> <Download className="h-4 w-4" /></Button>
                </div>
              
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
