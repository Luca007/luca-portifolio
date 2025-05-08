"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import generateResumePDF from "@/lib/pdfGenerator";
import { toast } from "@/components/ui/toast";

export default function ResumeDownload() {
	const { content, currentLanguage } = useLanguage();
	const [isLoading, setIsLoading] = useState(false);

	const handleDownload = async () => {
		setIsLoading(true);

		try {
			// Generate PDF based on current language content and await the result
			const pdfBlobUrl = await generateResumePDF(content);

			// Create filename based on language
			const pdfFileName = `Luca_Clerot_Aviani_CV_${currentLanguage.code.toUpperCase()}.pdf`;

			// Create a link to download the PDF
			const link = document.createElement("a");
			link.href = pdfBlobUrl;
			link.download = pdfFileName;

			// Simulate a short delay for the loading animation
			setTimeout(() => {
				link.click();

				// Clean up the URL object after download completes
				setTimeout(() => {
					URL.revokeObjectURL(pdfBlobUrl);
					setIsLoading(false);
					toast({
						title: "Download Successful",
						description: "The PDF has been downloaded successfully.",
						variant: "success",
					});
				}, 100);
			}, 800);
		} catch (error) {
			console.error("Error generating PDF:", error);
			setIsLoading(false);

			// Display a more specific error message
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred while generating the PDF.";

			toast({
				title: "Download Failed",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col items-center"
		>
			<Button
				onClick={handleDownload}
				disabled={isLoading}
				className="relative overflow-hidden group bg-gradient-to-r from-primary/90 to-blue-600/90 hover:from-blue-600/90 hover:to-primary/90 transition-all duration-500 text-white shadow-md hover:shadow-xl shadow-primary/20 hover:shadow-primary/40 rounded-lg px-6 py-6"
			>
				<span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

				<span className="flex items-center justify-center">
					{isLoading ? (
						<Loader2 className="w-5 h-5 mr-2 animate-spin" />
					) : (
						<FileDown className="w-5 h-5 mr-2" />
					)}
					<span>
						{isLoading
							? content.resume.downloading
							: content.resume.download}
					</span>
				</span>
			</Button>

			<p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
				{content.resume.description}
			</p>
		</motion.div>
	);
}
