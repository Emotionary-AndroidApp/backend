import axios from "axios";

interface AddTodoProps {
  id: number;
}

interface ResponseBody {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default async function addTodo({ id }: AddTodoProps) {
  const response = await axios.get<ResponseBody>(
    "https://jsonplaceholder.typicode.com/todos",
    {
      params: {
        id,
      },
    }
  );
  return response;
}
