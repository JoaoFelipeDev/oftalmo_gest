// src/components/pacientes/PatientSearchCombobox.tsx
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchPatientsByName } from '@/lib/data';
import { AddPatientDialog } from './../pacientes/AddPatientDialog';

interface Patient { id: string; nome: string; }
interface PatientSearchComboboxProps {
  onPatientSelect: (patientId: string) => void;
  initialValue?: string;
}

export function PatientSearchCombobox({ onPatientSelect, initialValue }: PatientSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [selectedPatientName, setSelectedPatientName] = React.useState(initialValue || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const loadPatients = async () => {
      const results = await searchPatientsByName(search);
      setPatients(results);
    };
    if (search.length > 1) {
      loadPatients();
    } else {
      setPatients([]);
    }
  }, [search]);
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedPatientName || "Selecione um paciente..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Pesquisar paciente..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.nome}
                    onSelect={() => {
                      setSelectedPatientName(patient.nome);
                      onPatientSelect(patient.id);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedPatientName === patient.nome ? "opacity-100" : "opacity-0")} />
                    {patient.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => {
                  setOpen(false);
                  setIsAddDialogOpen(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                  Cadastrar novo paciente
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AddPatientDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}