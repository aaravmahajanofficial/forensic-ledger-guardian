import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUp, Eye, Lock, Unlock, FileCheck, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock activity data
const activities = [
	{
		id: 1,
		type: "upload",
		user: "John Smith",
		userInitials: "JS",
		description: "Uploaded hard drive disk image for case #FF-2023-104.",
		timestamp: "2025-04-09T10:23:45Z",
	},
	{
		id: 2,
		type: "view",
		user: "Emily Johnson",
		userInitials: "EJ",
		description: "Viewed evidence EV-104-001 in case #FF-2023-104.",
		timestamp: "2025-04-09T11:45:12Z",
	},
	{
		id: 3,
		type: "lock",
		user: "Michael Chen",
		userInitials: "MC",
		description: "Sealed case #FF-2023-092 for court proceedings.",
		timestamp: "2025-04-09T13:12:33Z",
	},
	{
		id: 4,
		type: "verify",
		user: "Sarah Lee",
		userInitials: "SL",
		description: "Verified integrity of email archive EV-089-005.",
		timestamp: "2025-04-08T16:37:21Z",
	},
	{
		id: 5,
		type: "unlock",
		user: "Michael Chen",
		userInitials: "MC",
		description: "Unsealed case #FF-2023-078 after hearing.",
		timestamp: "2025-04-08T09:05:48Z",
	},
];

const activityConfig = {
	upload: {
		icon: FileUp,
		color: "text-primary",
		bg: "bg-primary/10",
	},
	view: {
		icon: Eye,
		color: "text-accent",
		bg: "bg-accent/10",
	},
	lock: {
		icon: Lock,
		color: "text-destructive",
		bg: "bg-destructive/10",
	},
	unlock: {
		icon: Unlock,
		color: "text-green-600",
		bg: "bg-green-500/10",
	},
	verify: {
		icon: FileCheck,
		color: "text-secondary",
		bg: "bg-secondary/10",
	},
	default: {
		icon: ShieldQuestion,
		color: "text-muted-foreground",
		bg: "bg-muted",
	},
};

const RecentActivityList = () => {
	const formatTimeAgo = (timestamp: string) => {
		const now = new Date();
		const activityDate = new Date(timestamp);
		const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

		if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d ago`;
	};

	return (
		<div className="space-y-6">
			{activities.map((activity, index) => {
				const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig.default;

				return (
					<div key={activity.id} className="flex items-start space-x-4 group">
						<div className="relative">
							<Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary/50 transition-all">
								<AvatarImage src={`https://i.pravatar.cc/40?u=${activity.user}`} alt={activity.user} />
								<AvatarFallback className={cn("font-bold", config.bg, config.color)}>
									{activity.userInitials}
								</AvatarFallback>
							</Avatar>
							{index < activities.length - 1 && (
								<div className="absolute top-12 left-5 h-full w-0.5 bg-border group-hover:bg-primary/50 transition-all" />
							)}
						</div>
						<div className="flex-1 pt-1">
							<p className="text-sm text-foreground">
								<span className="font-semibold">{activity.user}</span>
								<span className="text-muted-foreground"> {activity.description}</span>
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{formatTimeAgo(activity.timestamp)}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default RecentActivityList;
