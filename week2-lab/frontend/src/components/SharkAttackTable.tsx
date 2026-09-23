import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import type {
    SharkAttack,
} from '../types/sharkAttack';

type SharkAttackTableProps = {
  sharkAttacks: SharkAttack[];
  onSelect: (id: number) => void;
  onEdit: (sharkAttack: SharkAttack) => void;
  onDelete: (id: number) => void;
};

export function SharkAttackTable({
  sharkAttacks,
  onSelect,
  onEdit,
  onDelete,
}: SharkAttackTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }}
              >
                DATE
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }}
              >
                COUNTRY
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }}
              >
                TYPE
              </Typography>
            </TableCell>

            <TableCell>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }}
              >
                SPECIES
              </Typography>
            </TableCell>

            <TableCell align="right">
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700 }}
              >
                ACTION
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sharkAttacks.map(
            (sharkAttack) => (
              <TableRow
                key={sharkAttack.id}
                hover
              >
                <TableCell>
                  {sharkAttack.fecha ?? '—'}
                </TableCell>

                <TableCell>
                  {sharkAttack.país ?? '—'}
                </TableCell>

                <TableCell>
                  {sharkAttack.tipo ?? '—'}
                </TableCell>

                <TableCell>
                  {sharkAttack.especie ?? '—'}
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    onClick={() =>
                      onSelect(
                        sharkAttack.id,
                      )
                    }
                  >
                    VER
                  </Button>

                  <Button
                    size="small"
                    onClick={() =>
                      onEdit(
                        sharkAttack,
                      )
                    }
                  >
                    EDITAR
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      onDelete(
                        sharkAttack.id,
                      )
                    }
                  >
                    ELIMINAR
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}