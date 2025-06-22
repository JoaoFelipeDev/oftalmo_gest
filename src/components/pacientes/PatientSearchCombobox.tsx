    // src/components/pacientes/PatientSearchCombobox.tsx
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { searchPatientsByName } from '@/lib/data';
import { AddPatientDialog } from './AddPatientDialog';

interface Patient {
  id: string;
  nome: string;
}

interface PatientSearchComboboxProps {
  onPatientSelect: (patientId: string) => void;
}

export function PatientSearchCombobox({ onPatientSelect }: PatientSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (search.length < 2) {
      setPatients([]);
      return;
    }
    const loadPatients = async () => {
      const results = await searchPatientsByName(search);
      setPatients(results);
    };
    loadPatients();
  }, [search]);
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedPatient ? selectedPatient.nome : "Selecione um paciente..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput 
              placeholder="Pesquisar paciente..." 
              value={search} 
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                Nenhum paciente encontrado.
              </CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.nome}
                    onSelect={() => {
                      setSelectedPatient(patient);
                      onPatientSelect(patient.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatient?.id === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {patient.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => setIsAddDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4 text-primary" />
                  Cadastrar novo paciente
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* O nosso modal de cadastro de paciente, controlado por este componente */}
      <AddPatientDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}   