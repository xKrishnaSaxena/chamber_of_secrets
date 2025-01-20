import { useState } from "react";
import { Cross } from "../../iconSvgs/Cross";
import { Button } from "./Button";
import { Input } from "./Input";

import axios from "axios";
const BACKEND_URL = "http://localhost:5000";
enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}
interface ModalProps {
  open: boolean;
  onClose: () => void;
}

// controlled component
export function Modal({ open, onClose }: ModalProps) {
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [type, setType] = useState<ContentType>(ContentType.Youtube);

  async function addContent() {
    if (!title || !link) {
      alert("Please fill in all fields.");
      return;
    }

    await axios.post(
      `${BACKEND_URL}/api/v1/content`,
      {
        link,
        title,
        type,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    // Reset the form and close the modal
    setTitle("");
    setLink("");
    onClose();
  }

  return (
    <div>
      {open && (
        <div>
          <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center"></div>
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
              <span className="bg-white opacity-100 p-4 rounded fixed">
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <Cross />
                  </div>
                </div>
                <div>
                  <Input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTitle(e.target.value)
                    }
                    placeholder={"Title"}
                  />
                  <Input
                    value={link}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLink(e.target.value)
                    }
                    placeholder={"Link"}
                  />
                </div>
                <div>
                  <h1>Type</h1>
                  <div className="flex gap-1 justify-center pb-2">
                    <Button
                      text="Youtube"
                      variant={
                        type === ContentType.Youtube ? "primary" : "secondary"
                      }
                      onClick={() => setType(ContentType.Youtube)}
                    />
                    <Button
                      text="Twitter"
                      variant={
                        type === ContentType.Twitter ? "primary" : "secondary"
                      }
                      onClick={() => setType(ContentType.Twitter)}
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={addContent}
                    variant="primary"
                    text="Submit"
                  />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
