import { useGlobalContext } from '@/context/GlobalContext';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SoftwareCommentsProps {
    softwareId: number;
}

const SoftwareComments: React.FC<SoftwareCommentsProps> = ({ softwareId }) => {
    const router = useRouter();

    const { comments, deleteComment, currentUser } = useGlobalContext();

    const filteredComments = comments.filter(comment => comment.software_id === softwareId);

    const handleDelete = async (commentId: number) => {
        try {
            const token = localStorage.getItem('access_token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                toast('Session Expired', {
                    description: 'Your session expired. Please Log In again.',
                    icon: <AlertCircle className="mr-2 h-4 w-4" />,
                    action: {
                        label: 'Log In',
                        onClick: () => { router.push('/authentication') }
                    },
                    duration: 10000
                })
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            deleteComment(commentId);

            toast("Comment Deleted", {
                icon: <CheckCircle className="mr-2 h-4 w-4" />,
            })
        }
        catch (error: any) {
            toast('Error', {
                description: `${error.message}`,
                icon: <AlertCircle className="mr-2 h-4 w-4" />
            })
        }
    };

    return (
        <div>
            <h4 className="text-sm font-medium mb-2">Comments</h4>
            <ScrollArea className="rounded-scroll-area h-[200px] w-full p-4">
                <div className="space-y-4">
                    {filteredComments.length === 0 ? (
                        <p>No comments available for this software</p>
                    ) : (
                        filteredComments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-2 rounded-md flex items-center justify-between space-y-1">
                                <div>
                                    <p className="text-sm font-medium mb-1">{comment.user_name || 'Anonymous'}</p>
                                    <p className="text-sm mb-2">{comment.content}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Satisfaction: {comment.satisfaction_rate}/10
                                    </p>
                                </div>

                                {comment.user_id === currentUser?.user_id ?
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(comment.id)}
                                        className="ml-4"
                                    >
                                        Delete
                                    </Button> : ''
                                }
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SoftwareComments;
