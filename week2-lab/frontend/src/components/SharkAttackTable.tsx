import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import type { SharkAttack } from '../types/sharkAttack';

type SharkAttackTableProps = {
  sharkAttacks: SharkAttack[];
  onSelect?: (id: number) => void;
  onEdit?: (attack: SharkAttack) => void;
  onDelete?: (id: number) => void;
};

export function SharkAttackTable({
  sharkAttacks,
  onSelect,
  onEdit,
  onDelete,
}: SharkAttackTableProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(20, 120, 145, 0.16)',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(244,251,253,0.94))',
        boxShadow: '0 18px 45px rgba(8, 61, 78, 0.08)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            borderColor: 'rgba(20, 120, 145, 0.10)',
          },
          '& .MuiTableRow-root:last-child .MuiTableCell-root': {
            borderBottom: 0,
          },
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow
              sx={{
                background: 'rgba(14, 116, 144, 0.045)',
              }}
            >
              <TableCell sx={{ width: 60 }} />

              {[
                'Fecha',
                'País',
                'Tipo',
                'Especie',
                'Ubicación',
                'Acciones',
              ].map((label) => (
                <TableCell key={label}>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      color: '#46616C',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sharkAttacks.map((attack, index) => {
              const danger =
                attack.tipo?.toLowerCase().includes('fatal') ||
                attack.tipo?.toLowerCase().includes('provoked');

              return (
                <TableRow
                  key={attack.id}
                  sx={{
                    transition: 'background 180ms ease',
                    '&:hover': {
                      background: 'rgba(14, 116, 144, 0.045)',
                    },
                    '&:hover .record-index': {
                      color: '#0E7490',
                    },
                    '&:hover .record-actions': {
                      opacity: 1,
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      className="record-index"
                      sx={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: '#8AA3AD',
                        letterSpacing: '0.04em',
                        transition: 'color 180ms ease',
                      }}
                    >
                      {String(index + 1).padStart(3, '0')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#173744',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {attack.fecha || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 650,
                        color: '#46616C',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {String((attack as any)['pa\u00EDs'] || '-')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={attack.tipo || 'Unknown'}
                      size="small"
                      sx={{
                        height: 25,
                        borderRadius: 999,
                        border: '1px solid rgba(14, 116, 144, 0.16)',
                        background: danger
                          ? 'rgba(220, 70, 70, 0.08)'
                          : 'rgba(14, 116, 144, 0.07)',
                        color: danger ? '#B42318' : '#0E7490',
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 650,
                        color: '#173744',
                        lineHeight: 1.4,
                      }}
                    >
                      {attack.especie || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                      }}
                    >
                      <LocationOnOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: '#0E7490',
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#46616C',
                          lineHeight: 1.4,
                        }}
                      >
                        {String((attack as any)['ubicaci\u00F3n'] || '-')}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      className="record-actions"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        opacity: 0.55,
                        transition: 'opacity 180ms ease',
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => onSelect?.(attack.id)}
                        sx={{
                          minWidth: 0,
                          px: 1,
                          color: '#0E7490',
                          fontSize: 10,
                          fontWeight: 750,
                          '&:hover': {
                            background: 'rgba(14, 116, 144, 0.07)',
                          },
                        }}
                      >
                        Ver
                      </Button>

                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit?.(attack)}
                        sx={{
                          minWidth: 0,
                          px: 1,
                          color: '#46616C',
                          fontSize: 10,
                          fontWeight: 750,
                          '&:hover': {
                            background: 'rgba(14, 116, 144, 0.07)',
                            color: '#0E7490',
                          },
                        }}
                      >
                        Editar
                      </Button>

                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete?.(attack.id)}
                        sx={{
                          minWidth: 0,
                          px: 1,
                          color: danger ? '#B42318' : '#718792',
                          fontSize: 10,
                          fontWeight: 750,
                          '&:hover': {
                            background: danger
                              ? 'rgba(220, 70, 70, 0.08)'
                              : 'rgba(14, 116, 144, 0.07)',
                            color: danger ? '#B42318' : '#0E7490',
                          },
                        }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          borderTop: '1px solid rgba(20, 120, 145, 0.10)',
          background: 'rgba(14, 116, 144, 0.025)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#0E7490',
              boxShadow: '0 0 0 4px rgba(14, 116, 144, 0.10)',
            }}
          />

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.13em',
              color: '#46616C',
              textTransform: 'uppercase',
            }}
          >
            Registros cargados
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 12,
            color: '#718792',
          }}
        >
          {sharkAttacks.length} registros visibles
        </Typography>
      </Box>
    </Box>
  );
}
