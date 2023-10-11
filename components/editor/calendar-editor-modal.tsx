import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCopy } from '@fortawesome/free-solid-svg-icons';

export function CalendarModal({ data }) {
  const handleCopyExportLink = () => {
    const exportLinkInput = document.getElementById('username');

    // Create a range to select text within the input field
    const range = document.createRange();
    range.selectNode(exportLinkInput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      // Attempt to copy the selected text to the clipboard
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      // Optionally, you can show a success message to the user here
    } catch (error) {
      console.error('Copy failed: ', error);
      // Handle the copy error here
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Calendar Links</DialogTitle>
          <DialogDescription>Import and export iCal Links</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Import Link
            </Label>
            <div className="relative col-span-3">
              <Input id="name" value="" type="text" />
              <button className="absolute right-4 top-2">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Export Link
            </Label>
            <div className="relative col-span-3">
              <Input
                id="username"
                disabled
                value={`https://forhosts.com/api/post/${data.id}/calendar.ics`}
              />
              <button className="absolute right-4 top-2" onClick={handleCopyExportLink}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
