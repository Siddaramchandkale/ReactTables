import React, { useEffect, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

interface Artwork {
    id: number;
    title: string;
    artist_display: string;
    date_display: string;
}

const Table: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState<Artwork | null>(null);

    useEffect(() => {
        fetchArtworks(1);
    }, []);

    const fetchArtworks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=15`
            );
            setArtworks(response.data.data);
            setTotalRecords(response.data.pagination.total);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (e: DataTableStateEvent) => {
        const currentPage = e.page || 0;
        fetchArtworks(currentPage + 1);
    };

    const onRowSelect = (e: { originalEvent: React.SyntheticEvent; value: Artwork }) => {
        setSelection(e.value);
    };

    return (
        <div>
            <DataTable
                value={artworks}
                tableStyle={{ minWidth: '50rem' }}
                paginator
                rows={15}
                totalRecords={totalRecords}
                lazy
                loading={loading}
                onPage={onPageChange}
                selection={selection}
                onSelectionChange={onRowSelect}
                dataKey="id"
                rowHover
                selectionMode="single"
            >
                <Column field="id" header="ID"></Column>
                <Column field="title" header="Title"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="date_display" header="Date"></Column>
            </DataTable>

            <div>
                <h3>Selected Row</h3>
                {selection && (
                    <p>
                        {selection.title} by {selection.artist_display}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Table;