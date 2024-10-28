'use client'

import { useState, useMemo, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGlobalContext } from '@/context/GlobalContext';
import { Software } from '@/types/types';

type FilterOption = {
    value: string;
    label: string;
    group: string;
};

type SoftwareItem = {
    id: number;
    name: string;
    department: string;
    status: string;
    vendor: string;
    division: string;
};

const sampleData: SoftwareItem[] = [
    { id: 1, name: 'Office 365', department: 'IT', status: 'Active', vendor: 'Microsoft', division: 'North America' },
    { id: 2, name: 'Photoshop', department: 'Marketing', status: 'Active', vendor: 'Adobe', division: 'Europe' },
    { id: 3, name: 'Salesforce CRM', department: 'Sales', status: 'Pending', vendor: 'Salesforce', division: 'Asia Pacific' },
    { id: 4, name: 'Oracle ERP', department: 'Finance', status: 'Active', vendor: 'Oracle', division: 'Latin America' },
    { id: 5, name: 'SAP HR', department: 'HR', status: 'Inactive', vendor: 'SAP', division: 'North America' },
    { id: 6, name: 'Power BI', department: 'Operations', status: 'Active', vendor: 'Microsoft', division: 'Europe' },
    { id: 7, name: 'Illustrator', department: 'Marketing', status: 'Deprecated', vendor: 'Adobe', division: 'Asia Pacific' },
    { id: 8, name: 'Dynamics 365', department: 'Finance', status: 'Pending', vendor: 'Microsoft', division: 'Latin America' },
];

export default function FiltersPopover() {
    const { software, departments, divisions, filteredSoftwareList, setFilteredSoftwareList } = useGlobalContext();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

    const toggleFilter = (value: string) => {
        setSelectedFilters((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

    const filterOptions: FilterOption[] = getFilterOptions(software, departments, divisions);

    function getFilterOptions(
        software: {
            software_name: string;
            software_department: { name: string }[];
            software_divisions_using: { name: string }[];
            software_operational_status: string;
        }[],
        departments: { id: number; name: string }[],
        divisions: { id: number; name: string }[]
    ): FilterOption[] {
        const filterOptions: FilterOption[] = [];

        const operationalStatuses = new Set<string>();
        for (const item of software) {
            operationalStatuses.add(item.software_operational_status);
        }

        filterOptions.push(...software.map((item) => ({
            value: item.software_name,
            label: item.software_name,
            group: 'Software Name',
        })));
        filterOptions.push(...departments.map((dept) => ({
            value: dept.name,
            label: dept.name,
            group: 'Department',
        })));
        filterOptions.push(...divisions.map((div) => ({
            value: div.name,
            label: div.name,
            group: 'Division',
        })));
        filterOptions.push(...Array.from(operationalStatuses).map((value) => ({
            value,
            label: value === 'A' ? 'Active' : 'Inactive',
            group: 'Operational Status',
        })));

        return filterOptions;
    }

    const clearFilters = () => setSelectedFilters([]);

    const groups = Array.from(new Set(filterOptions.map((option) => option.group)));

    const filteredData = useMemo(() => {
        if (selectedFilters.length === 0) return sampleData;

        return sampleData.filter((item) => {
            const softwareNameFilter = selectedFilters.filter((f) => filterOptions.find((fo) => fo.value === f && fo.group === 'Software Name'));
            const departmentFilter = selectedFilters.filter((f) => filterOptions.find((fo) => fo.value === f && fo.group === 'Department'));
            const statusFilter = selectedFilters.filter((f) => filterOptions.find((fo) => fo.value === f && fo.group === 'Operational Status'));
            const vendorFilter = selectedFilters.filter((f) => filterOptions.find((fo) => fo.value === f && fo.group === 'Vendor'));
            const divisionFilter = selectedFilters.filter((f) => filterOptions.find((fo) => fo.value === f && fo.group === 'Division'));

            return (
                (softwareNameFilter.length === 0 || softwareNameFilter.includes(item.name.toLowerCase())) &&
                (departmentFilter.length === 0 || departmentFilter.includes(item.department.toLowerCase())) &&
                (statusFilter.length === 0 || statusFilter.includes(item.status.toLowerCase())) &&
                (vendorFilter.length === 0 || vendorFilter.includes(item.vendor.toLowerCase())) &&
                (divisionFilter.length === 0 || divisionFilter.includes(item.division.toLowerCase()))
            );
        });
    }, [selectedFilters, filterOptions]);

    // Store filtered data in Global Context
    useEffect(() => {
        if (JSON.stringify(filteredSoftwareList) !== JSON.stringify(filteredData)) {
            const transformedData: Software[] = filteredData.map((item) => ({
                id: item.id,
                software_name: item.name,
                software_description: '',
                software_department: [{ id: 1, name: item.department }],
                software_version: undefined,
                software_years_of_use: undefined,
                software_last_updated: new Date().toISOString(),
                software_expiration_date: '',
                software_is_hosted: 'No',
                software_is_tech_supported: 'Yes',
                software_is_cloud_based: undefined,
                software_maintenance_support: 'None',
                software_vendor: [{ id: 1, name: item.vendor }],
                software_department_contact_people: [],
                software_divisions_using: [{ id: 1, name: item.division }],
                software_comments: undefined,
                software_number_of_licenses: 0,
                software_to_operate: [],
                hardware_to_operate: [],
                software_gl_accounts: [],
                software_operational_status: item.status,
                software_annual_amount: undefined,
            }));

            setFilteredSoftwareList(transformedData);
        }
    }, [filteredData, setFilteredSoftwareList, filteredSoftwareList]);


    return (
        <div className="space-y-4">
            <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between md:w-[280px]"
                    >
                        {selectedFilters.length > 0
                            ? `${selectedFilters.length} filter${selectedFilters.length > 1 ? 's' : ''} selected`
                            : "Select filters..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                {/* Popover content */}
                <PopoverContent className="w-full p-0 md:w-[300px]">
                    <Command>
                        <CommandInput placeholder="Search filters..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {groups.map((group, index) => (
                                <div key={group}>
                                    {index > 0 && <CommandSeparator />}
                                    <CommandGroup heading={group}>
                                        {filterOptions
                                            .filter((option) => option.group === group)
                                            .map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => toggleFilter(option.value)}
                                                >
                                                    <div className="flex items-center">
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedFilters.includes(option.value) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {option.label}
                                                    </div>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </div>
                            ))}
                        </CommandList>
                        {selectedFilters.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={clearFilters}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
