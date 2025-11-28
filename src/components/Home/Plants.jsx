import Card from "./Card";
import Container from "../Shared/Container";
import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "../../hooks/useAxiosSecure";

const Plants = () => {
  const axioSecure = useAxiosSecure();
  const {
    data: plants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const result = await axioSecure.get("/plants");
      return result.data;
    },
  });

  console.log(plants);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading plants</div>;

  return (
    <Container>
      {plants && plants.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {plants?.map((plant) => (
            <Card key={plant.id} plant={plant} />
          ))}
        </div>
      ) : null}
    </Container>
  );
};

export default Plants;
