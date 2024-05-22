import ListIcon from "../icons/list-icon";
import TrashIcon from "../icons/trash-icon";

export default function VideoCard({ url }: { url: string }) {
  console.log(url);
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg space-x-2 w-80">
      <div className="flex items-center">
        <div className="bg-gray-700 p-2 mr-4 aspect-square" />
        <div>
          <h3 className="text-white">Video Title 1</h3>
          <p className="text-gray-400">10:57</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <ListIcon className="text-white h-4 w-4 cursor-grab" />
        <TrashIcon className="text-white h-4 w-4 cursor-pointer" />
      </div>
    </div>
  );
}
