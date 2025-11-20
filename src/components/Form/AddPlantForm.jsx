import { useForm } from "react-hook-form";
import { imageUpload } from "../../Utils";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const AddPlantForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  //useMutation hook usecase can be added here for form submission to backend (POST || PUT || DELETE || PATCH)

  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset, // to reset mutation state optional
  } = useMutation({
    mutationFn: async (newPlant) => await axiosSecure.post("/plants", newPlant),
    onSuccess: (data) => {
      console.log("Plant added successfully:", data);
      toast.success("Plant added successfully!");
      mutationReset();
    },
    onError: (error) => {
      console.error("Error adding plant:", error);
    },
    onMutate: (newPlant) => {
      console.log("Adding new plant...", newPlant);
    },
    onSettled: (data, error) => {
      if (data) {
        console.log("Add plant mutation settled with data:", data);
      }
      if (error) {
        console.error("Add plant mutation settled with error:", error);
      }
    },
    retry: 3,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, description, quantity, price, category, image } = data;
    const imageFile = image[0];

    const imageURL = await imageUpload(imageFile);
    const plantData = {
      image: imageURL,
      name,
      description,
      category,
      price: Number(price),
      quantity: Number(quantity),
      seller: {
        email: user?.email,
        image: user?.photoURL,
        name: user?.displayName,
      },
    };

    reset();
    await mutateAsync(plantData);

    console.log(plantData);
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                // name="name"
                id="name"
                type="text"
                placeholder="Plant Name"
                // required
                {...register("name", {
                  required: true,
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                // name="category"
                {...register("category", {
                  required: true,
                })}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                // name="description"
                {...register("description", {
                  required: true,
                })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  // name="price"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  // required
                  {...register("price", {
                    required: true,
                    min: {
                      value: 0,
                      message: "pease provide product price",
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  // name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                  // required
                  {...register("quantity", {
                    required: true,
                    min: {
                      value: 1,
                      message: "please select your minimum quantity",
                    },
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      // name="image"
                      id="image"
                      accept="image/*"
                      hidden
                      {...register("image", {
                        required: true,
                      })}
                    />
                    {errors.iamge && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.image.message}
                      </p>
                    )}
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              Save & Continue
              {isPending ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
