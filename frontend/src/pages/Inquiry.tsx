import { useState } from "react";
import {
    useGetContactsQuery,
    useChangeContactStatusMutation,
    useUpdateContactMutation,
} from "@/store/api/contactApi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type StatusType = "NEW" | "CONTACTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

const Admin = () => {
    const { data, isLoading, error, refetch } = useGetContactsQuery();
    const [changeContactStatus, { isLoading: isUpdatingStatus }] = useChangeContactStatusMutation();
    const [updateContact, { isLoading: isUpdatingContact }] = useUpdateContactMutation();
    const { toast } = useToast();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const getStatusColor = (status: StatusType) => {
        switch (status) {
            case "NEW":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200";
            case "CONTACTED":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200";
            case "COMPLETED":
                return "bg-green-100 text-green-800 hover:bg-green-200";
            case "REJECTED":
                return "bg-red-100 text-red-800 hover:bg-red-200";
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200";
        }
    };

    const handleUpdateContact = async (inquiryId: string, newStatus: StatusType) => {
        const inquiry = data?.data?.find((inquiry: any) => inquiry.id === inquiryId);
        const { ...updatedInquiry } = inquiry;
        updatedInquiry.status = newStatus;
        try {
            const response = await updateContact({
                id: inquiryId,
                formData: {
                    ...updatedInquiry,
                },
            }).unwrap();

            if (response.success) {
                await refetch();
                toast({
                    title: "Status Updated",
                    description: `Inquiry status has been updated to ${newStatus
                        .toLowerCase()
                        .replace("_", " ")}.`,
                });
            }
        } catch (error: any) {
            console.error("Failed to update status:", error);
            toast({
                title: "Update Failed",
                description:
                    error?.data?.message || "Failed to update inquiry status. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredInquiries =
        data?.data?.filter((inquiry: any) => {
            const matchesSearch =
                inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
            return matchesSearch && matchesStatus;
        }) || [];

    const stats = {
        total: data?.data?.length || 0,
        new: data?.data?.filter((i: any) => i.status === "NEW").length || 0,
        inProgress: data?.data?.filter((i: any) => i.status === "IN_PROGRESS").length || 0,
        completed: data?.data?.filter((i: any) => i.status === "COMPLETED").length || 0,
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Logged Out",
                description: "You have been successfully logged out.",
            });
        } catch (error: any) {
            toast({
                title: "Logout Error",
                description: "There was an issue logging out. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading inquiries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading inquiries</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Logout */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Inquiry Management
                        </h1>
                        <p className="text-gray-600">Manage and track all client inquiries</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span className="font-medium">
                                    {user.displayName || user.email}
                                </span>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {user.role}
                                </span>
                            </div>
                        )}
                        <Button
                            onClick={handleLogout}
                            disabled={authLoading}
                            variant="outline"
                            className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                            <LogOut className="h-4 w-4" />
                            <span>{authLoading ? "Logging out..." : "Logout"}</span>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Inquiries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">New</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                In Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.inProgress}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.completed}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search inquiries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Inquiries Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">
                                            Name & Email
                                        </TableHead>
                                        <TableHead className="font-semibold">Company</TableHead>
                                        <TableHead className="font-semibold">
                                            Project Type
                                        </TableHead>
                                        <TableHead className="font-semibold">Budget</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInquiries.map((inquiry: any) => (
                                        <TableRow key={inquiry.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {inquiry.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {inquiry.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-900">
                                                    {inquiry.company || "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-900 capitalize">
                                                    {inquiry.projectType}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-900">
                                                    {inquiry.budget || "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={inquiry.status}
                                                    onValueChange={(value) =>
                                                        handleUpdateContact(
                                                            inquiry.id,
                                                            value as StatusType
                                                        )
                                                    }
                                                    disabled={isUpdatingStatus}>
                                                    <SelectTrigger className="w-32">
                                                        <Badge
                                                            className={getStatusColor(
                                                                inquiry.status
                                                            )}>
                                                            {inquiry.status}
                                                        </Badge>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NEW">New</SelectItem>
                                                        <SelectItem value="CONTACTED">
                                                            Contacted
                                                        </SelectItem>
                                                        <SelectItem value="IN_PROGRESS">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="COMPLETED">
                                                            Completed
                                                        </SelectItem>
                                                        <SelectItem value="REJECTED">
                                                            Rejected
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600">
                                                    {new Date(
                                                        inquiry.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedInquiry(inquiry)}
                                                    className="h-8 w-8 p-0">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredInquiries.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    No inquiries found matching your criteria.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
