import { useGlobalContext } from "@/context/GlobalContext";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Software, NewSoftware, NewContactPerson } from "@/types/types"
import { PlusCircle, X, Plus } from "lucide-react"
import MultipleSelectionField from "./MultipleSelectionField"
import { toast } from "sonner";

interface SoftwareDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (software: Software) => Response
    mode: 'add' | 'edit'
    software?: Software
}

export default function SoftwareDialog({ isOpen, onClose, onSave, mode, software }: SoftwareDialogProps) {
    const {
        divisions,
        departments,
        vendors,
        hardwareToOperate,
        softwareToOperate,
        contacts,
        glAccounts,
        updateSoftware,
    } = useGlobalContext();
    const [showRegisterNewContactForm, setShowRegisterNewContactForm] = useState<boolean>(false);
    const [newSoftware, setNewSoftware] = useState<NewSoftware>({
        software_name: "",
        software_description: "",
        software_department: [],
        software_version: "",
        software_years_of_use: 0,
        software_last_updated: "",
        software_expiration_date: "",
        software_is_hosted: "",
        software_is_tech_supported: "NO",
        software_is_cloud_based: "",
        software_maintenance_support: "NO",
        software_vendor: [],
        software_department_contact_people: [],
        software_divisions_using: [],
        software_comments: "",
        software_number_of_licenses: 0,
        software_to_operate: [],
        hardware_to_operate: [],
        software_annual_amount: 0,
        software_gl_accounts: [],
        software_operational_status: ""
    })
    const [newContact, setNewContact] = useState<NewContactPerson>({
        contact_name: "",
        contact_lastname: "",
        contact_email: "",
        contact_phone_number: null
    })

    useEffect(() => {
        if (mode === 'edit' && software) {
            setNewSoftware(software as NewSoftware);
        }
        else if (mode === 'add') {
            setNewSoftware({
                software_name: "",
                software_description: "",
                software_department: [],
                software_version: "",
                software_years_of_use: 0,
                software_last_updated: "",
                software_expiration_date: "",
                software_is_hosted: "",
                software_is_tech_supported: "NO",
                software_is_cloud_based: "",
                software_maintenance_support: "NO",
                software_vendor: [],
                software_department_contact_people: [],
                software_divisions_using: [],
                software_comments: "",
                software_number_of_licenses: 0,
                software_to_operate: [],
                hardware_to_operate: [],
                software_annual_amount: 0,
                software_gl_accounts: [],
                software_operational_status: ""
            })
        }
    }, [mode, software]);

    const handleSelectionChange = (key: keyof typeof newSoftware) => (newItems: string[]) => {
        setNewSoftware((prev) => ({ ...prev, [key]: newItems }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const saveResponse = await onSave(newSoftware as Software);
            
            if (!saveResponse.ok) {
                throw new Error('Failed to create software');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software`);

            if (!response.ok) {
                throw new Error('Failed to fetch updated software list');
            }

            const updatedSoftwareList = await response.json();

            // Update the software state with the new list
            updateSoftware(updatedSoftwareList);

            onClose(); // Close the dialog
            toast.success(mode === 'add' ? 'Software created successfully' : 'Software updated successfully');
        }
        catch (error) {
            console.error('Error saving software:', error);
            toast.error('Failed to save software. Please try again.');
        }
    };


    const handleRegisterNewContactToApi = async () => {
        try {
            if (newContact.contact_name && newContact.contact_lastname && newContact.contact_email && newContact.contact_phone_number) {
                console.log(newContact)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-people`, {
                    method: "POST",
                    body: JSON.stringify(newContact)
                });

                if (!response.ok) throw new Error(`Failed to fetch data from ${`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-person`}`);

                const data = response.json();

                console.log('Posted New Contact Response:', data);
            }
            else {
                throw new Error('You need to complete all fields in the Register New Contact form')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleAddContact = async () => {
        const newContact: NewContactPerson = {
            contact_name: "",
            contact_lastname: "",
            contact_email: undefined,
            contact_phone_number: undefined
        }
        setNewSoftware({
            ...newSoftware,
            software_department_contact_people: [...newSoftware.software_department_contact_people, newContact]
        })
    }

    const handleRemoveContact = (name: string) => {
        const newContacts = newSoftware.software_department_contact_people.filter(contact => contact.contact_name !== name)
        setNewSoftware({
            ...newSoftware,
            software_department_contact_people: newContacts
        })
    }

    const handleContactSelect = (name: string) => {
        const selectedContact = contacts.find(contact => contact.contact_name === name);

        if (selectedContact && selectedContact.contact_name !== "") {
            const contactExists = newSoftware.software_department_contact_people.some(
                cont => cont.contact_name === selectedContact.contact_name
            );

            if (!contactExists) {
                setNewSoftware({
                    ...newSoftware,
                    software_department_contact_people: [
                        ...newSoftware.software_department_contact_people.filter(cont => cont.contact_name !== ""),
                        selectedContact
                    ]
                });
            }
        }
    };

    const handleRegisterNewContact = () => {
        setShowRegisterNewContactForm(true);
    }

    const handleNewContactCancel = () => {
        setNewContact({
            contact_name: "",
            contact_lastname: "",
            contact_email: "",
            contact_phone_number: null
        });

        setShowRegisterNewContactForm(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add New Software' : 'Edit Software'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newSoftware.software_name}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_name: e.target.value })}
                                className="col-span-3"
                                required
                                placeholder="Software Name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={newSoftware.software_description}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_description: e.target.value })}
                                className="col-span-3 max-h-[130px]"
                                required
                                placeholder="Software Description"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="version" className="text-right">
                                Version
                            </Label>
                            <Input
                                id="version"
                                value={newSoftware.software_version}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_version: e.target.value })}
                                className="col-span-3"
                                placeholder="1.0.0"
                            />
                        </div>
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="Departments"
                            items={departments}
                            selectedItems={newSoftware.software_department}
                            onChange={handleSelectionChange('software_department')}
                        />
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="Divisions Using"
                            items={divisions}
                            selectedItems={newSoftware.software_divisions_using || []}
                            onChange={handleSelectionChange('software_divisions_using')}
                        />
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="Vendors"
                            items={vendors}
                            selectedItems={newSoftware.software_vendor}
                            onChange={handleSelectionChange('software_vendor')}
                        />
                        <Separator className="my-4" />
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right mt-2">Department Contacts</Label>
                            <div className="col-span-3 space-y-2">
                                {newSoftware.software_department_contact_people.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Select
                                            value={contact.contact_name}
                                            onValueChange={(value) => handleContactSelect(value)}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select contact" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {contacts.filter(contact => contact.contact_name.toLowerCase() !== 'unknown').map((cont, index) => (
                                                    <SelectItem key={index} value={cont.contact_name}>
                                                        {cont.contact_name} {cont.contact_lastname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveContact(contact.contact_name)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={handleAddContact}>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Contact
                                </Button>
                                <Button className="ml-2" type="button" variant="outline" onClick={handleRegisterNewContact}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Register New Contact
                                </Button>
                            </div>
                        </div>
                        {showRegisterNewContactForm && (
                            <div className="grid grid-cols-4 place-items-center gap-1">
                                <div className="col-span-4 space-y-2 w-[60%] p-4 border rounded-md">
                                    <Input
                                        placeholder="Name"
                                        value={newContact.contact_name}
                                        onChange={(e) => setNewContact({ ...newContact, contact_name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Lastname"
                                        value={newContact.contact_lastname}
                                        onChange={(e) => setNewContact({ ...newContact, contact_lastname: e.target.value })}
                                    />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={newContact.contact_email}
                                        onChange={(e) =>
                                            setNewContact({ ...newContact, contact_email: e.target.value })
                                        }
                                    />
                                    <Input
                                        placeholder="Phone"
                                        value={newContact.contact_phone_number}
                                        onChange={
                                            (e) => setNewContact({ ...newContact, contact_phone_number: e.target.value })
                                        }
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={handleNewContactCancel}>
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={handleRegisterNewContactToApi}>
                                            Add Contact
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Separator className="my-4" />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expirationDate" className="text-right">
                                Date Last Upgraded
                            </Label>
                            <Input
                                id="expirationDate"
                                required
                                type="date"
                                value={newSoftware.software_last_updated ? newSoftware.software_last_updated.split('T')[0] : ''}
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    setNewSoftware({
                                        ...newSoftware,
                                        software_last_updated: dateValue ? `${dateValue}` : null
                                    });
                                }}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expirationDate" className="text-right">
                                Expiration Date
                            </Label>
                            <Input
                                id="expirationDate"
                                required
                                type="date"
                                value={newSoftware.software_expiration_date ? newSoftware.software_expiration_date.split('T')[0] : ''}
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    setNewSoftware({
                                        ...newSoftware,
                                        software_expiration_date: dateValue ? `${dateValue}` : null
                                    });
                                }}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="operationalStatus" className="text-right">
                                Operational Status
                            </Label>
                            <Select
                                value={newSoftware.software_operational_status}
                                onValueChange={(value) => setNewSoftware({ ...newSoftware, software_operational_status: value as "Active" | "Inactive" })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="yearsOfUse" className="text-right">
                                Years of Use
                            </Label>
                            <Input
                                id="yearsOfUse"
                                type="number"
                                min={0}
                                value={newSoftware.software_years_of_use}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_years_of_use: parseInt(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hosting" className="text-right">
                                Hosted
                            </Label>
                            <Select
                                value={newSoftware.software_is_hosted}
                                onValueChange={(value) => setNewSoftware({ ...newSoftware, software_is_hosted: value as "Internal" | "External" })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select hosting" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INT">Internally</SelectItem>
                                    <SelectItem value="EXT">Externally</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pt-1">
                            <Label htmlFor="edit-isTechSupported" className="text-right">
                                Is Tech Supported
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Switch
                                    id="is-tech-supported"
                                    checked={newSoftware.software_is_tech_supported === "YES"}
                                    onCheckedChange={(checked) => setNewSoftware({
                                        ...newSoftware,
                                        software_is_tech_supported: checked ? "YES" : "NO"
                                    })}
                                />
                                <span className="ml-2">
                                    {newSoftware.software_is_tech_supported === "YES" ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pt-1">
                            <Label htmlFor="maintenance-support-contract" className="text-right">
                                Cloud Based
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Switch
                                    id="software-is-cloud-based"
                                    checked={newSoftware.software_is_cloud_based === "YES"}
                                    onCheckedChange={(checked) => setNewSoftware({
                                        ...newSoftware,
                                        software_is_cloud_based: checked ? "YES" : "NO"
                                    })}
                                />
                                <span className="ml-2">
                                    {newSoftware.software_is_cloud_based === "YES" ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pt-1">
                            <Label htmlFor="maintenance-support-contract" className="text-right">
                                Maintenance Contract
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Switch
                                    id="maintenance-support-contract"
                                    checked={newSoftware.software_maintenance_support === "YES"}
                                    onCheckedChange={(checked) => setNewSoftware({
                                        ...newSoftware,
                                        software_maintenance_support: checked ? "YES" : "NO"
                                    })}
                                />
                                <span className="ml-2">
                                    {newSoftware.software_maintenance_support === "YES" ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="numberOfLicenses" className="text-right">
                                Number of Licenses
                            </Label>
                            <Input
                                id="numberOfLicenses"
                                type="number"
                                min={0}
                                value={newSoftware.software_number_of_licenses}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_number_of_licenses: parseInt(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="annualCost" className="text-right">
                                Annual Cost
                            </Label>
                            <Input
                                id="annualCost"
                                type="number"
                                min={0}
                                value={newSoftware.software_annual_amount}
                                onChange={(e) => setNewSoftware({ ...newSoftware, software_annual_amount: parseFloat(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="Software To Operate"
                            items={softwareToOperate}
                            selectedItems={newSoftware.software_to_operate}
                            onChange={handleSelectionChange('software_to_operate')}
                        />
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="Hardware To Operate"
                            items={hardwareToOperate}
                            selectedItems={newSoftware.hardware_to_operate}
                            onChange={handleSelectionChange('hardware_to_operate')}
                        />
                        <Separator className="my-4" />
                        <MultipleSelectionField
                            label="GL Accounts"
                            items={glAccounts}
                            selectedItems={newSoftware.software_gl_accounts}
                            onChange={handleSelectionChange('software_gl_accounts')}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">{mode === 'add' ? 'Create Software' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}