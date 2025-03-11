import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu"
import { checkUser } from "@/lib/checkUser";
  

//header components
const header = async () => {
    //if user present return
    await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-backdrop/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Sensei Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* action buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
            {/* if signned in then show all these action buttons */}
            <SignedIn>
                <Link href="/dashboard">
                    <Button variant="outline">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden md:block">Industry Insights</span>
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button>
                            <StarIcon className="h-4 w-4" />
                            <span className="hidden md:block">Growth Tools</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link href={"/resume"} className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Build Resume</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                                <PenBox className="h-4 w-4" />
                                <span>Cover Letter</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/interview"} className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>Interview Prep</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedIn>
            {/* if signed out then show sign in or user button */}
            <SignedOut>
                <SignInButton>
                    <Button variant="outline">Sign In</Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton appearance={{
                    elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "shadow-xl",
                        userPreviewMainIdentifier: "font-semibold"
                    }
                }} afterSignOutUrl="/" />
            </SignedIn>

        </div>
      </nav> 
    </header>
  );
};

export default header;
