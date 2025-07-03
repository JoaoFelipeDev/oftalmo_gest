// src/components/agenda/ConsultationForm.tsx
'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createConsultation } from './actions';
import { PatientSearchCombobox } from '@/components/pacientes/PatientSearchCombobox';
import { getConveniosByPatientId, type PatientConvenio, type Resource } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Schema de validação
const consultationSchema = z.object({
  data_consulta: z.date({ required_error: 'A data da consulta é obrigatória.' }),
  paciente_id: z.string({ required_error: 'Selecione um paciente.' }),
  horario: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Formato de hora inválido (use HH:MM).' }),
  medico_id: z.string({ required_error: 'Selecione um médico.' }),
  procedimento: z.string().min(3, { message: 'Descreva o procedimento.' }),
  valor: z.string().optional(),
  status: z.string(),
  paciente_convenio_id: z.string().optional(), // novo campo
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  medicos: Resource[];
  onSuccess?: () => void;
}

export function ConsultationForm({ medicos, onSuccess }: ConsultationFormProps) {
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      status: 'Agendada',
    },
  });

  const [patientConvenios, setPatientConvenios] = React.useState<PatientConvenio[]>([]);
  const [isLoadingConvenios, setIsLoadingConvenios] = React.useState(false);
  const selectedPatientId = form.watch('paciente_id');

  React.useEffect(() => {
    if (!selectedPatientId) {
      setPatientConvenios([]);
      return;
    }

    const fetchConvenios = async () => {
      setIsLoadingConvenios(true);
      const data = await getConveniosByPatientId(selectedPatientId);
      setPatientConvenios(data);
      setIsLoadingConvenios(false);
    };

    fetchConvenios();
  }, [selectedPatientId]);

  const onSubmit = async (data: ConsultationFormValues) => {
    const formData = new FormData();
    formData.append('data_consulta', data.data_consulta.toISOString());
    formData.append('paciente_id', data.paciente_id);
    formData.append('horario', data.horario);
    formData.append('medico_id', data.medico_id);
    formData.append('procedimento', data.procedimento);
    formData.append('status', data.status);
    if (data.valor) formData.append('valor', data.valor);
    if (data.paciente_convenio_id) formData.append('paciente_convenio_id', data.paciente_convenio_id);

    const result = await createConsultation(formData);

    if (result?.success) {
      toast.success('Consulta agendada com sucesso!');
      if (onSuccess) onSuccess();
    } else {
      toast.error(result?.error || 'Ocorreu um erro desconhecido.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="paciente_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Paciente</FormLabel>
              <PatientSearchCombobox
                onPatientSelect={(patientId) => field.onChange(patientId)}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de Convênio */}
        <FormField
          control={form.control}
          name="paciente_convenio_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Convênio</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedPatientId || isLoadingConvenios}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingConvenios ? 'Carregando...' : 'Selecione o convênio'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patientConvenios.length > 0 ? (
                    patientConvenios.map(pc => (
                      <SelectItem key={pc.id} value={pc.id}>
                        {pc.convenios?.nome} - {pc.plano} ({pc.numero_matricula})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum convênio cadastrado para este paciente.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medico_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Médico</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um médico" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {medicos.map(medico => (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_consulta"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="procedimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Consulta de rotina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? 'Agendando...' : 'Agendar Consulta'}
        </Button>
      </form>
    </Form>
  );
}
