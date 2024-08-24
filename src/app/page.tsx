"use client"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Card, CardActions, CardContent, CardMedia, TextField } from '@mui/material';
import { useAddAnimalMutation, useAddCategoryMutation, useGetAnimalQuery, useGetCategoryQuery } from '@/redux/api/baseApi';
import Image from 'next/image';
interface FormValues {
  name: string;
}
type FormValuesTwo = {
  display_url: any;
  animal: string;
  category: string,
  animalImage: FileList;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};
interface Category {
  id: number; // Adjust the type based on your API response
  name: string; // Adjust the type based on your API response
  // Add other properties as needed
}

type CategoriesResponse = Category[];
export default function Home() {
  const { register: registerCategory, handleSubmit: handleSubmitCategory, formState: { errors: errorsCategory } } = useForm<FormValues>()
  const { register: registerAnimal, handleSubmit: handleSubmitAnimal, formState: { errors: errorsAnimal } } = useForm<FormValuesTwo>()
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [opens, setOpens] = useState(false);
  const handleOpens = () => setOpens(true);
  const handleCloses = () => setOpens(false);
  const [animals, setAnimals] = useState([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const { data: resData } = useGetCategoryQuery(undefined);
  const { data: getAnimal } = useGetAnimalQuery({ name: selectedName || "" });
  const handleFilter = (name: string) => {
    setSelectedName(name);
  }
  const [addCategory] = useAddCategoryMutation();
  const [addAnimal] = useAddAnimalMutation();
  const [namesc, setNamesc] = useState('');
  const handleChange: any = (event: SelectChangeEvent): any => {
    setNamesc(event.target.value as string);
  };



  // post categories
  const onSubmitCategory: SubmitHandler<FormValues> = async (data) => {
    const response = await addCategory(data);
    if (response) {
      toast(`${data?.name} added successfully`)
      setOpen(false)
    }
  }
  // post animal
  const onSubmitAnimal: SubmitHandler<FormValuesTwo> = async (data) => {
    console.log("Submitted data:", data);
    const fileList = data.animalImage; // Correctly get the FileList object
    if (fileList && fileList.length > 0) {
      const file = fileList[0]; // Access the first file from the FileList
      const formData = new FormData();
      formData.append('image', file);
      try {
        // Send the POST request to ImageBB API
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_KEY}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response?.data) {
          const Datas = {
            animalName: data?.animal,
            imageURL: response?.data?.data?.display_url as any,
            category: namesc
          }
          const res = await addAnimal(Datas);
          toast(`${Datas?.animalName} Animal added successfully`);
          setOpens(false);
        }
      } catch (error) {
        console.error("Upload error:", error); // Handle the error
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <main className="px-[20px] py-20">
      <div className='flex justify-center lg:justify-end'>
        <Button onClick={handleOpens} sx={{
          marginRight: '20px',
          borderRadius: '30px', color: 'white', borderColor: 'white', ":hover": {
            color: 'white',
            borderColor: 'white'
          }
        }} variant="outlined">Add Animal</Button>
        <Button onClick={handleOpen} sx={{
          borderRadius: '30px', color: 'white', borderColor: 'white', ":hover": {
            color: 'white',
            borderColor: 'white'
          }
        }} variant="outlined">Add Category</Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmitCategory(onSubmitCategory)}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Category
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                type="text"
                sx={{ width: '100%' }}
                label="Add Category"
                {...registerCategory("name", { required: "Name is required" })}
              />
              {errorsCategory?.name && <p className='text-start text-red-500'>{errorsCategory.name.message}</p>}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input type="submit" className=" block w-full bg-black hover:cursor-pointer text-white border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none" id="grid-last-name" />
            </Typography>
          </Box>
        </form>
      </Modal>
      <Modal
        open={opens}
        onClose={handleCloses}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmitAnimal(onSubmitAnimal)}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Animal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                type="text"
                sx={{ width: '100%' }}
                label="Animal Name"
                {...registerAnimal("animal", { required: "Animal Name is required" })}
              />
              {errorsAnimal?.animal && <p className='text-start text-red-500'>{errorsAnimal.animal.message}</p>}
            </Typography>
            <Typography id="modal-modal-description" sx={{ minWidth: 120, mt: 2 }}>
              <TextField
                type="file"
                {...registerAnimal("animalImage", { required: "Animal Image is required" })}
              />
              {errorsAnimal?.animalImage && <p className='text-start text-red-500'>{errorsAnimal.animalImage.message}</p>}
            </Typography>
            <Typography>
              <Box sx={{ minWidth: 120, marginTop: '20px' }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    label="Category"
                    value={namesc}
                    onChange={handleChange}
                  >
                    {resData?.map((d: any) => (
                      <MenuItem key={d.id} value={d.name}
                        {...registerAnimal("category", { required: "Category is required" })}
                      >
                        {d.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input type="submit" name="Create Animal" value="Create Animal" className=" hover:bg-black hover:text-white block w-full bg-black hover:cursor-pointer text-white border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none" id="grid-last-name" />
            </Typography>
          </Box>
        </form>
      </Modal>
      <Box>
        <div className="flex mt-4 justify-center lg:justify-start">
          <MenuItem>
            <Button sx={{
              borderRadius: '30px', color: 'red', borderColor: 'red', ":hover": {
                color: 'red',
                borderColor: 'red'
              }
            }} onClick={() => handleFilter('AllAnimal')} variant="outlined">All Animal</Button>
          </MenuItem>
          {resData?.map((d: any) => (
            <MenuItem key={d.id} value={d.name}
            >
              <Button sx={{
                borderRadius: '30px', color: 'white', borderColor: 'white', ":hover": {
                  color: 'white',
                  borderColor: 'white'
                }
              }} onClick={() => handleFilter(d.name)} variant="outlined">{d.name}</Button>
            </MenuItem>
          ))}
        </div>
      </Box>
      <Box>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-20 place-items-center'>
          {getAnimal && getAnimal.length > 0 ? (
            getAnimal.map((an: any, index: number) => (
              <div key={index} className='w-3/4'>
                <div className="backdrop-blur-sm bg-white/5 border border-gray-500 rounded-lg">
                  <div className="flex flex-col items-center justify-center pb-10 my-[150px] h-[5vh]">
                    <Image
                      src={an?.imageURL}
                      height={1200}
                      width={1200}
                      alt=''
                    />
                  </div>
                </div>
                <h5 className="mb-1 text-3xl font-light text-center text-white space-grotesk">
                  {an?.animalName}
                </h5>
              </div>
            ))
          ) : (
            <h1 className='text-5xl text-red-500'>No Animal Added here!</h1>
          )}
        </div>
      </Box>



    </main >
  );
}
