"use client"

import { useState, useEffect, useMemo } from "react"
import { useGlobalContext } from "@/context/GlobalContext";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Grid, 
  List, 
  ArrowUpDown, 
  FileDown, 
  Search, 
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { Software, CommentToAdd } from "@/types/types"
import SoftwareDialog from "./SoftwareDialog";
import Sidebar from "./Sidebar"
import Header from "./Header"
import Pagination from "./Pagination";
import { YesNoIndicator } from "./YesNoIndicator";
import SoftwareComments from "@/components/SoftwareComments";
import Context from "@/components/Context";

const mockUser = {
  name: "cereda",
  position: "Technology Intern",
  avatar: "https://github.com/shadcn.png"
}

export default function Dashboard() {
  const {
    software,
    isDialogOpen,
    dialogMode,
    selectedSoftware,
    setIsDialogOpen,
    handleAddSoftware,
    handleEditSoftware,
    handleSaveSoftware,
    setSelectedSoftware,
    editingSoftware,
    setComments,
    updateSoftware,
    generateCSV,
    downloadCSV,
    filteredSoftwareList,
  } = useGlobalContext();
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [viewMode, setViewMode] = useState("list")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [newComment, setNewComment] = useState<CommentToAdd>({
    user_id: 1,
    user_name: "cereda",
    software_id: selectedSoftware?.id,
    content: '',
    satisfaction_rate: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  // Toggle Sidebar
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (selectedSoftware?.id) {
      setNewComment(prev => ({
        ...prev,
        software_id: selectedSoftware.id
      }));
    }
  }, [selectedSoftware]);

  useEffect(() => {
    software.forEach(s => {
      if (isExpirationClose(s.software_expiration_date)) {
        showNotification(`${s.software_name} is expiring soon!`)
        sendEmailAlert(`${s.software_name} is expiring on ${format(s.software_expiration_date, 'yyyy-MM-dd')}`)
      }
    })
  }, [software])

  const handleRemoveSoftware = async (softwareToDelete: Software) => {
    if (!softwareToDelete) return;

    const updatedSoftware = software.filter((s) => s.id !== softwareToDelete.id);
    
    updateSoftware(updatedSoftware);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software/${softwareToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      toast(`${softwareToDelete.software_name} was deleted successfully.`);

      const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software`);

      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch updated software list.");
      }

      const data = await fetchResponse.json();

      updateSoftware(data || []);
    }
    catch (error) {
      console.error("Error deleting software:", error);

      updateSoftware(software);
      toast.error(`Failed to delete ${softwareToDelete.software_name}. Please try again.`);
    }

    setSoftwareToDelete(null);
  };

  const handleAddComment = async () => {
    if (!selectedSoftware?.id) {
      toast.error('No software selected');
      return;
    }

    if (!newComment.content) {
      toast.error('Please add a comment');
      return;
    }

    try {
      const commentPayload = {
        ...newComment,
        software_id: selectedSoftware.id,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/v1/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const commentsResponse = await fetch(`http://127.0.0.1:8000/api/v1/software/${selectedSoftware.id}/comments`);

      if (!commentsResponse.ok) {
        throw new Error('Failed to fetch updated comments');
      }

      const updatedComments = await commentsResponse.json();

      setComments(updatedComments);

      setNewComment({
        user_id: 1,
        user_name: "cereda",
        software_id: selectedSoftware?.id,
        content: '',
        satisfaction_rate: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      toast.success('Comment added successfully!');
    }
    catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Could not add new comment. Please try again later');
    }
  };

  const isExpirationClose = (date: string) => {
    const daysUntilExpiration = differenceInDays(new Date(date), new Date())
    return daysUntilExpiration <= 30
  }

  const showNotification = (message: String) => {
    console.log("Notification:", message)
  }

  const sendEmailAlert = (message: String) => {
    console.log("Email Alert:", message)
  }

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  const sortedSoftware = useMemo(() => {
    let sortableItems = [...software];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [software, sortConfig]);

  const filteredSoftware = sortedSoftware.filter(s =>
    s.software_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.software_vendor.map(vend => vend.name).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage)
  const displayedSoftware = filteredSoftware.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const handleExportAll = () => {
    const csv = generateCSV(software);
    downloadCSV(csv, 'all_software.csv');
  }

  const handleExportIndividual = (s: Software) => {
    const csv = generateCSV([s]);
    downloadCSV(csv, `${s.software_name.replace(/\s+/g, '_').toLowerCase()}_report.csv`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Context/>
      <div className="min-h-screen flex">
        <Sidebar mockUser={mockUser} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        <div className={`flex-1 overflow-auto transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Actions Bar */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Software List</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleAddSoftware}>
                    <Plus className="mr-2 h-4 w-4" /> Add Software
                  </Button>
                  <SoftwareDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSaveSoftware}
                    mode={dialogMode}
                    software={editingSoftware}
                  />
                  <Button onClick={handleExportAll}>
                    <FileDown className="mr-2 h-4 w-4" /> Generate Report
                  </Button>
                </div>
              </div> 
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Name or Vendor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              {/* Table or List of Software Licenses */}
              {viewMode === "list" ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                          Name {sortConfig.key === 'name' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                        </TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('dateLastUpdated')}>
                          Last Updated {sortConfig.key === 'dateLastUpdated' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('expirationDate')}>
                          Expiration {sortConfig.key === 'expirationDate' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                        </TableHead>
                        <TableHead>Operational Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedSoftware.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.software_name}</TableCell>
                          <TableCell>{s.software_version ? s.software_version : <span className="text-gray-400 font-style: italic">N/A</span>}</TableCell>
                          <TableCell>
                            {
                              s.software_vendor.length > 0
                                ?
                                s.software_vendor.map(vend => vend.name).join('/')
                                :
                                <span className="text-gray-400 font-style: italic">N/A</span>
                            }
                          </TableCell>
                          <TableCell>{format(s.software_last_updated, 'yyyy-MM-dd')}</TableCell>
                          <TableCell>
                            {format(s.software_expiration_date, 'yyyy-MM-dd')}
                            {isExpirationClose(s.software_expiration_date) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertTriangle className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Expiration is near</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={s.software_operational_status === "A" ? "text-green-600" : "text-red-600"}>
                              {s.software_operational_status === "A" ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedSoftware(s)}>
                                Details
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditSoftware(s)}>
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => setSoftwareToDelete(s)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedSoftware.map((s) => (
                      <Card key={s.id} className="flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-lg truncate">{s.software_name}</CardTitle>
                          <CardDescription className="line-clamp-2">{s.software_description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="truncate">Department: {s.software_department.map(dept => dept.name).join('/')}</p>
                          <p className="truncate">Version: {s.software_version}</p>
                          <p className="truncate">Vendor: {s.software_vendor.map(dept => dept.name).join('/')}</p>
                          <p className="truncate">Last Updated: {format(s.software_last_updated, 'yyyy-MM-dd')}</p>
                          <p className="truncate">
                            Expiration: {format(s.software_expiration_date, 'yyyy-MM-dd')}
                            {isExpirationClose(s.software_expiration_date) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertTriangle className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Expiration is near!</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </p>
                          <p className="mt-2 truncate">
                            Operational Status:
                            <span className={s.software_operational_status === "A" ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                              {s.software_operational_status === "A" ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </CardContent>
                        <CardFooter>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedSoftware(s)}>
                              Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditSoftware(s)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setSoftwareToDelete(s)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
              {selectedSoftware && (
                <Dialog open={!!selectedSoftware} onOpenChange={() => setSelectedSoftware(undefined)}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedSoftware.software_name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">Description: {selectedSoftware.software_description}</p>
                      <p className="text-sm">Version: {selectedSoftware.software_version ? selectedSoftware.software_version : <span className="text-gray-400 font-style: italic">Unknown</span>}</p>
                      <p className="text-sm">
                        Vendor: {
                          selectedSoftware.software_vendor.length > 0
                            ?
                            selectedSoftware.software_vendor.map(vend => vend.name).join(',')
                            :
                            <span className="text-gray-400 font-style: italic">Unknown</span>
                        }
                      </p>
                      <p className="text-sm">
                        Last Updated: {format(selectedSoftware.software_last_updated, 'yyyy-MM-dd')}
                      </p>
                      <p className="text-sm">
                        Expiration Date: {format(selectedSoftware.software_expiration_date, 'yyyy-MM-dd')}
                        {isExpirationClose(selectedSoftware.software_expiration_date) && (
                          <span className="ml-2 text-yellow-500">Expiring soon!</span>
                        )}
                      </p>
                      <p className="text-sm">
                        Operational Status:
                        <span className={selectedSoftware.software_operational_status === "A" ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                          {selectedSoftware.software_operational_status === "A" ? "Active" : "Inactive"}
                        </span>
                      </p>
                      <p className="text-sm">Years of Use: {selectedSoftware.software_years_of_use}</p>
                      <p className="text-sm">Hosted: {selectedSoftware.software_is_hosted === 'INT' ? "Internally" : "Externally"}</p>
                      <YesNoIndicator
                        label="Tech Supported"
                        value={selectedSoftware.software_is_tech_supported}
                      />
                      <YesNoIndicator
                        label="Maintenance Supported"
                        value={selectedSoftware.software_maintenance_support}
                      />
                      <YesNoIndicator
                        label="Cloud Based"
                        value={selectedSoftware.software_is_cloud_based}
                      />
                      <p className="text-sm">Division/s: {selectedSoftware.software_divisions_using.map(dept => dept.name).join(', ')}</p>
                      <p className="text-sm">Department/s: {selectedSoftware.software_department.map(dept => dept.name).join(', ')}</p>
                      {
                        selectedSoftware.software_department_contact_people.map(contact => (
                          <>
                            <p className="text-sm">Department Contact Name: {contact.contact_name} {contact.contact_lastname}</p>
                            {
                              contact.contact_phone_number ?
                                <p className="text-sm">Department Contact Number: +1{contact.contact_phone_number}</p> : ''
                            }
                            <p className="text-sm">
                              Department Contact Email:{" "}
                              <a
                                href={`mailto:${contact.contact_email}`}
                                className="text-blue-500 hover:underline"
                              >
                                {contact.contact_email}
                              </a>
                            </p>
                          </>
                        ))
                      }
                      <p className="text-sm">Number of Licenses: {selectedSoftware.software_number_of_licenses}</p>
                      <p className="text-sm">Annual Cost: {selectedSoftware.software_annual_amount ? '$' + selectedSoftware.software_annual_amount.toLocaleString() : <span className="text-gray-400 font-style: italic">Not Estimated</span>}</p>
                      <p className="text-sm">
                        GL Account/s:
                        {
                          selectedSoftware.software_gl_accounts.length > 0
                            ?
                            selectedSoftware.software_gl_accounts.map(account => (
                              <span className="ml-1">{account.name}</span>
                            ))
                            :
                            <span className="text-gray-400 font-style: italic"> No GL Accounts Associated</span>
                        }
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Software To Operate</h4>
                      <div className="space-y-2">
                        {selectedSoftware.software_to_operate.map((sto, index) => (
                          <div key={index}>
                            <ul className="list-disc list-inside">
                              <li key={sto.id} className="text-sm">{sto.name}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Hardware To Operate</h4>
                      <div className="space-y-2">
                        {selectedSoftware.hardware_to_operate.map((hto, index) => (
                          <div key={index}>
                            <ul className="list-disc list-inside">
                              <li key={hto.id} className="text-sm">{hto.name}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <SoftwareComments softwareId={selectedSoftware.id} />
                    <div className="space-y-4 mt-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment?.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                      />
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="satisfaction">Satisfaction (1-10):</Label>
                        <Slider
                          id="satisfaction"
                          min={1}
                          max={10}
                          step={1}
                          value={[newComment?.satisfaction_rate]}
                          onValueChange={(value) => setNewComment({ ...newComment, satisfaction_rate: value[0] })}
                          className="w-[200px]"
                        />
                        <span className="text-sm">{newComment?.satisfaction_rate}</span>
                      </div>
                      <Button onClick={handleAddComment}>Add Comment</Button>
                    </div>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => handleExportIndividual(selectedSoftware)}>
                        <FileDown className="mr-2 h-4 w-4" /> Export Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {/* Confirmation Dialog for Deleting Software */}
              <Dialog open={!!softwareToDelete} onOpenChange={() => setSoftwareToDelete(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {softwareToDelete?.software_name}? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSoftwareToDelete(null)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => handleRemoveSoftware(softwareToDelete)}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}