import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Brain, Search, Clock, Calendar, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '../ui/label';
import { useAIHistory } from '../../features/ai/hooks';

export const AIHistory: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const { data: historyItems = [], isLoading } = useAIHistory();

    // Filter history items based on search term and date
    const filteredItems = historyItems.filter(item =>
        item.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (dateFilter ? new Date(item.created_at).toDateString() === new Date(dateFilter).toDateString() : true)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        AI Classification History
                    </h2>
                    <p className="text-gray-600">Review previous medical image classifications</p>
                </div>

                <Button onClick={() => navigate('/doctor/ai')}>
                    <Brain className="h-4 w-4 mr-2" />
                    New Analysis
                </Button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by disease name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="w-full md:w-auto">
                    <Label htmlFor="date-filter" className="sr-only">
                        Date Filter
                    </Label>
                    <Input
                        id="date-filter"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full md:w-auto"
                    />
                </div>
            </div>

            {/* Results list */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        Analysis History
                    </CardTitle>
                    <CardDescription>
                        {isLoading
                            ? "Loading history..."
                            : `${filteredItems.length} ${filteredItems.length === 1 ? 'result' : 'results'} found`
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-sm text-muted-foreground">Loading history records...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed rounded-lg border-gray-200">
                            <p className="text-sm text-muted-foreground">No analysis history found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or perform new analyses</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredItems.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/doctor/ai/view/${item.id}`)}
                                    className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-primary hover:shadow-sm cursor-pointer transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Brain className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{item.disease_name}</h3>
                                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>Confidence: {(item.score * 100).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Button variant="ghost" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};